/**
 * This schema defines the InstanceCode entity. An `InstanceCode` is a single code value
 * belonging to a named code group (e.g. group `PAYMENT_METHOD`, value `01` = 'Credit Card').
 */
export interface InstanceCode {
    /**
     * Whether this code is currently active.
     */
    active?: boolean;
    /**
     * Change that lead to this version of the entity.
     */
    changeDescription?: ChangeDescription;
    /**
     * Code group identifier this code belongs to. Example: 'PAYMENT_METHOD'.
     */
    codeGroup: string;
    /**
     * Display name of the code group. Example: '결제수단코드'.
     */
    codeGroupName: string;
    /**
     * Display name for the code value. Example: '결제수단코드 1'.
     */
    codeName: string;
    /**
     * The code value within the group. Example: '01'.
     */
    codeValue: string;
    /**
     * When `true` indicates the entity has been soft deleted.
     */
    deleted?: boolean;
    /**
     * Description of this InstanceCode.
     */
    description?: string;
    /**
     * Name used for display purposes.
     */
    displayName?: string;
    /**
     * FullyQualifiedName same as `name`.
     */
    fullyQualifiedName?: string;
    /**
     * Link to the resource corresponding to this entity.
     */
    href?: string;
    /**
     * Unique identifier of this InstanceCode instance.
     */
    id: string;
    /**
     * Change that lead to this version of the entity.
     */
    incrementalChangeDescription?: ChangeDescription;
    /**
     * A unique name that identifies this InstanceCode. Example: 'PAYMENT_METHOD_01'.
     */
    name: string;
    /**
     * Date this code was registered, in 'yyyyMMdd' format.
     */
    registeredDate?: string;
    /**
     * Sort order of this code within its group.
     */
    sortOrder?: number;
    /**
     * Last update time corresponding to the new version of the entity in Unix epoch time
     * milliseconds.
     */
    updatedAt?: number;
    /**
     * User who made the update.
     */
    updatedBy?: string;
    /**
     * Metadata version of the entity.
     */
    version?: number;
}

/**
 * Change that lead to this version of the entity.
 *
 * Description of the change.
 */
export interface ChangeDescription {
    changeSummary?: { [key: string]: ChangeSummary };
    /**
     * Names of fields added during the version changes.
     */
    fieldsAdded?: FieldChange[];
    /**
     * Fields deleted during the version changes with old value before deleted.
     */
    fieldsDeleted?: FieldChange[];
    /**
     * Fields modified during the version changes with old and new values.
     */
    fieldsUpdated?: FieldChange[];
    /**
     * When a change did not result in change, this could be same as the current version.
     */
    previousVersion?: number;
}

export interface ChangeSummary {
    changedAt?: number;
    /**
     * Name of the user or bot who made this change
     */
    changedBy?:    string;
    changeSource?: ChangeSource;
    [property: string]: any;
}

/**
 * The source of the change. This will change based on the context of the change (example:
 * manual vs programmatic)
 */
export enum ChangeSource {
    Automated = "Automated",
    Derived = "Derived",
    Ingested = "Ingested",
    Manual = "Manual",
    Propagated = "Propagated",
    Suggested = "Suggested",
}

export interface FieldChange {
    /**
     * Name of the entity field that changed.
     */
    name?: string;
    /**
     * New value of the field. Note that this is a JSON string and use the corresponding field
     * type to deserialize it.
     */
    newValue?: any;
    /**
     * Previous value of the field. Note that this is a JSON string and use the corresponding
     * field type to deserialize it.
     */
    oldValue?: any;
}
