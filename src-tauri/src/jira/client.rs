use serde::{Serialize, Deserialize};
use crate::jira::{auth::JiraAuth, error::JiraError, config_manager::JiraConfigManager};

#[derive(Debug, Serialize, Deserialize)]
pub struct JiraUser {
    #[serde(rename = "accountId")]
    pub account_id: String,
    #[serde(rename = "displayName")]
    pub display_name: String,
    #[serde(rename = "emailAddress")]
    pub email_address: Option<String>,
    pub active: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JiraProject {
    pub id: String,
    pub key: String,
    pub name: String,
    pub description: Option<String>,
    #[serde(rename = "projectTypeKey")]
    pub project_type_key: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JiraIssue {
    pub id: String,
    pub key: String,
    pub summary: String,
    pub status: String,
    pub assignee: Option<String>,
    pub reporter: Option<String>,
    pub created: String,
    pub updated: String,
}

pub struct JiraClient {
    http_client: reqwest::Client,
    auth: JiraAuth,
    config_manager: JiraConfigManager,
}

impl JiraClient {
    pub fn new() -> Result<Self, JiraError> {
        let http_client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(30))
            .user_agent("Goji/1.0.0")
            .build()?;

        Ok(Self {
            http_client,
            auth: JiraAuth::new()?,
            config_manager: JiraConfigManager::new()?,
        })
    }


    pub async fn get_current_user(&self) -> Result<JiraUser, JiraError> {
        let config = self.config_manager.get_config()?
            .ok_or(JiraError::InvalidConfig("Configuração JIRA não encontrada".to_string()))?;

        let auth_header = self.auth.get_auth_header()?
            .ok_or(JiraError::AuthenticationFailed)?;

        let response = self.http_client
            .get(&format!("{}/rest/api/3/myself", config.url))
            .header("Authorization", auth_header)
            .header("Accept", "application/json")
            .send()
            .await?;

        if !response.status().is_success() {
            return Err(JiraError::AuthenticationFailed);
        }

        let user: JiraUser = response.json().await?;
        
        // Atualizar último uso
        self.auth.update_last_used()?;
        
        Ok(user)
    }

    pub async fn get_projects(&self) -> Result<Vec<JiraProject>, JiraError> {
        let config = self.config_manager.get_config()?
            .ok_or(JiraError::InvalidConfig("Configuração JIRA não encontrada".to_string()))?;

        let auth_header = self.auth.get_auth_header()?
            .ok_or(JiraError::AuthenticationFailed)?;

        let response = self.http_client
            .get(&format!("{}/rest/api/3/project", config.url))
            .header("Authorization", auth_header)
            .header("Accept", "application/json")
            .send()
            .await?;

        if !response.status().is_success() {
            return Err(JiraError::AuthenticationFailed);
        }

        let projects: Vec<JiraProject> = response.json().await?;
        
        // Atualizar último uso
        self.auth.update_last_used()?;
        
        Ok(projects)
    }

    pub async fn search_issues(&self, jql: &str, max_results: u32) -> Result<Vec<JiraIssue>, JiraError> {
        let config = self.config_manager.get_config()?
            .ok_or(JiraError::InvalidConfig("Configuração JIRA não encontrada".to_string()))?;

        let auth_header = self.auth.get_auth_header()?
            .ok_or(JiraError::AuthenticationFailed)?;

        #[derive(Serialize)]
        struct SearchRequest {
            jql: String,
            #[serde(rename = "maxResults")]
            max_results: u32,
            fields: Vec<String>,
        }

        let search_request = SearchRequest {
            jql: jql.to_string(),
            max_results,
            fields: vec![
                "summary".to_string(),
                "status".to_string(),
                "assignee".to_string(),
                "reporter".to_string(),
                "created".to_string(),
                "updated".to_string(),
            ],
        };

        let response = self.http_client
            .post(&format!("{}/rest/api/3/search", config.url))
            .header("Authorization", auth_header)
            .header("Accept", "application/json")
            .header("Content-Type", "application/json")
            .json(&search_request)
            .send()
            .await?;

        if !response.status().is_success() {
            return Err(JiraError::AuthenticationFailed);
        }

        #[derive(Deserialize)]
        struct SearchResponse {
            issues: Vec<RawIssue>,
        }

        #[derive(Deserialize)]
        struct RawIssue {
            id: String,
            key: String,
            fields: IssueFields,
        }

        #[derive(Deserialize)]
        struct IssueFields {
            summary: String,
            status: IssueStatus,
            assignee: Option<IssueUser>,
            reporter: Option<IssueUser>,
            created: String,
            updated: String,
        }

        #[derive(Deserialize)]
        struct IssueStatus {
            name: String,
        }

        #[derive(Deserialize)]
        struct IssueUser {
            #[serde(rename = "displayName")]
            display_name: String,
        }

        let search_response: SearchResponse = response.json().await?;
        
        let issues: Vec<JiraIssue> = search_response.issues.into_iter().map(|raw_issue| {
            JiraIssue {
                id: raw_issue.id,
                key: raw_issue.key,
                summary: raw_issue.fields.summary,
                status: raw_issue.fields.status.name,
                assignee: raw_issue.fields.assignee.map(|u| u.display_name),
                reporter: raw_issue.fields.reporter.map(|u| u.display_name),
                created: raw_issue.fields.created,
                updated: raw_issue.fields.updated,
            }
        }).collect();

        // Atualizar último uso
        self.auth.update_last_used()?;
        
        Ok(issues)
    }
}