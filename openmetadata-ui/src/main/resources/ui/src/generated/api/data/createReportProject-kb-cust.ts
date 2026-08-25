/**
 * Create ReportProject entity request
 */
export interface CreateReportProject {
    /**
     * Description of the ReportProject instance.
     */
    description?: string;
    /**
     * Display Name that identifies this ReportProject.
     */
    displayName?: string;
    /**
     * Name that identifies this ReportProject.
     */
    name: string;
    /**
     * Saved queries belonging to this report project.
     */
    queries?: ReportQuery[];
    type:     ReportProjectType;
}

/**
 * A single saved query against a target service.
 */
export interface ReportQuery {
    /**
     * The saved SQL query text.
     */
    query: string;
    /**
     * Fully qualified name of the service this query targets.
     */
    service: string;
}

/**
 * Recurrence type of this report project.
 */
export enum ReportProjectType {
    Adhoc = "Adhoc",
    Daily = "Daily",
    Monthly = "Monthly",
    Weekly = "Weekly",
}
