/*
 *  Copyright 2026 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
/**
 * Sybase Database Service connection.
 */
export interface SybaseConnection {
    connectionOptions?: { [key: string]: string };
    /**
     * Regex to only include/exclude databases that match the pattern.
     */
    databaseFilterPattern?: FilterPattern;
    /**
     * Regex to only include/exclude schemas that match the pattern.
     */
    schemaFilterPattern?: FilterPattern;
    /**
     * Source Python Class Name to be instantiated by the ingestion workflow
     */
    sourcePythonClass?:          string;
    supportsMetadataExtraction?: boolean;
    /**
     * Regex to only include/exclude tables that match the pattern.
     */
    tableFilterPattern?: FilterPattern;
    /**
     * Sybase database service type
     */
    type: SybaseType;
    [property: string]: any;
}

/**
 * Regex to only include/exclude databases that match the pattern.
 *
 * Regex to only fetch entities that matches the pattern.
 *
 * Regex to only include/exclude schemas that match the pattern.
 *
 * Regex to only include/exclude tables that match the pattern.
 */
export interface FilterPattern {
    /**
     * List of strings/regex patterns to match and exclude only database entities that match.
     */
    excludes?: string[];
    /**
     * List of strings/regex patterns to match and include only database entities that match.
     */
    includes?: string[];
}

/**
 * Sybase database service type
 */
export enum SybaseType {
    Sybase = "Sybase",
}
