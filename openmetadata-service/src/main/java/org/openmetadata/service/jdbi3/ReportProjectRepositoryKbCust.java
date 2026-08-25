package org.openmetadata.service.jdbi3;

import static org.openmetadata.service.Entity.REPORT_PROJECT;

import java.util.Objects;
import org.jdbi.v3.sqlobject.transaction.Transaction;
import org.openmetadata.schema.entity.data.ReportProject;
import org.openmetadata.schema.type.change.ChangeSource;
import org.openmetadata.service.Entity;
import org.openmetadata.service.resources.data.ReportProjectResourceKbCust;
import org.openmetadata.service.util.EntityUtil.Fields;
import org.openmetadata.service.util.EntityUtil.RelationIncludes;

public class ReportProjectRepositoryKbCust extends EntityRepository<ReportProject> {
  static final String UPDATE_FIELDS =
      "displayName,description,type,queries,requestDeptKbCust,requestEmployeeKbCust,"
          + "itOwnerDeptKbCust,itOwnerEmployeeKbCust,requestDateKbCust";
  static final String PATCH_FIELDS = UPDATE_FIELDS;

  public ReportProjectRepositoryKbCust() {
    super(
        ReportProjectResourceKbCust.COLLECTION_PATH,
        REPORT_PROJECT,
        ReportProject.class,
        Entity.getCollectionDAO().reportProjectDAO(),
        PATCH_FIELDS,
        UPDATE_FIELDS);
    supportsSearch = true;
  }

  @Override
  public void setFields(ReportProject entity, Fields fields, RelationIncludes relationIncludes) {
    /* No relationship fields to set */
  }

  @Override
  public void clearFields(ReportProject entity, Fields fields) {
    /* No relationship fields to clear */
  }

  @Override
  public void prepare(ReportProject entity, boolean update) {
    /* Nothing to validate beyond schema constraints */
  }

  @Override
  public void storeEntity(ReportProject entity, boolean update) {
    store(entity, update);
  }

  @Override
  public void storeRelationships(ReportProject entity) {
    /* No relationships to store */
  }

  @Override
  public EntityRepository<ReportProject>.EntityUpdater getUpdater(
      ReportProject original,
      ReportProject updated,
      Operation operation,
      ChangeSource changeSource) {
    return new ReportProjectUpdater(original, updated, operation);
  }

  public class ReportProjectUpdater extends EntityUpdater {
    public ReportProjectUpdater(
        ReportProject original, ReportProject updated, Operation operation) {
      super(original, updated, operation);
    }

    @Transaction
    @Override
    public void entitySpecificUpdate(boolean consolidatingChanges) {
      compareAndUpdate(
          "type", () -> recordChangeIfDifferent("type", original.getType(), updated.getType()));
      compareAndUpdate(
          "queries",
          () -> recordChange("queries", original.getQueries(), updated.getQueries(), true));
      compareAndUpdate(
          "requestDeptKbCust",
          () ->
              recordChangeIfDifferent(
                  "requestDeptKbCust",
                  original.getRequestDeptKbCust(),
                  updated.getRequestDeptKbCust()));
      compareAndUpdate(
          "requestEmployeeKbCust",
          () ->
              recordChangeIfDifferent(
                  "requestEmployeeKbCust",
                  original.getRequestEmployeeKbCust(),
                  updated.getRequestEmployeeKbCust()));
      compareAndUpdate(
          "itOwnerDeptKbCust",
          () ->
              recordChangeIfDifferent(
                  "itOwnerDeptKbCust",
                  original.getItOwnerDeptKbCust(),
                  updated.getItOwnerDeptKbCust()));
      compareAndUpdate(
          "itOwnerEmployeeKbCust",
          () ->
              recordChangeIfDifferent(
                  "itOwnerEmployeeKbCust",
                  original.getItOwnerEmployeeKbCust(),
                  updated.getItOwnerEmployeeKbCust()));
      compareAndUpdate(
          "requestDateKbCust",
          () ->
              recordChangeIfDifferent(
                  "requestDateKbCust",
                  original.getRequestDateKbCust(),
                  updated.getRequestDateKbCust()));
    }

    private void recordChangeIfDifferent(String field, Object origValue, Object updatedValue) {
      if (!Objects.equals(origValue, updatedValue)) {
        recordChange(field, origValue, updatedValue);
      }
    }
  }
}
