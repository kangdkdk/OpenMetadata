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
     * IT department responsible for this report project.
     */
    itOwnerDeptKbCust?: string;
    /**
     * IT employee responsible for this report project.
     */
    itOwnerEmployeeKbCust?: string;
    /**
     * Name that identifies this ReportProject.
     */
    name: string;
    /**
     * Saved queries belonging to this report project.
     */
    queries?: ReportQuery[];
    /**
     * Department that requested this report project.
     */
    requestDeptKbCust?: string;
    /**
     * Date the report project was requested (yyyy-MM-dd).
     */
    requestDateKbCust?: string;
    /**
     * Employee who requested this report project.
     */
    requestEmployeeKbCust?: string;
    type: ReportProjectType;
}

/**
 * A single saved query.
 */
export interface ReportQuery {
    /**
     * The saved SQL query text.
     */
    query: string;
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
