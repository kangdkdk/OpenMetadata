/**
 * Create InstanceCode entity request
 */
export interface CreateInstanceCode {
    /**
     * Whether this code is currently active.
     */
    active?: boolean;
    /**
     * Code group identifier this code belongs to.
     */
    codeGroup: string;
    /**
     * Display name of the code group.
     */
    codeGroupName: string;
    /**
     * Display name for the code value.
     */
    codeName: string;
    /**
     * The code value within the group.
     */
    codeValue: string;
    /**
     * Description of the InstanceCode instance.
     */
    description?: string;
    /**
     * Display Name that identifies this InstanceCode.
     */
    displayName?: string;
    /**
     * Name that identifies this InstanceCode.
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
}
