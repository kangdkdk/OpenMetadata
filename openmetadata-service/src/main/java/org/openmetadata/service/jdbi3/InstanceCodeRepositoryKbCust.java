package org.openmetadata.service.jdbi3;

import static org.openmetadata.service.Entity.INSTANCE_CODE;

import java.util.Objects;
import org.jdbi.v3.sqlobject.transaction.Transaction;
import org.openmetadata.schema.entity.data.InstanceCode;
import org.openmetadata.schema.type.change.ChangeSource;
import org.openmetadata.service.Entity;
import org.openmetadata.service.resources.data.InstanceCodeResourceKbCust;
import org.openmetadata.service.util.EntityUtil.Fields;
import org.openmetadata.service.util.EntityUtil.RelationIncludes;

public class InstanceCodeRepositoryKbCust extends EntityRepository<InstanceCode> {
  static final String UPDATE_FIELDS =
      "displayName,description,codeGroup,codeGroupName,codeValue,codeName,sortOrder,registeredDate,active";
  static final String PATCH_FIELDS = UPDATE_FIELDS;

  public InstanceCodeRepositoryKbCust() {
    super(
        InstanceCodeResourceKbCust.COLLECTION_PATH,
        INSTANCE_CODE,
        InstanceCode.class,
        Entity.getCollectionDAO().instanceCodeDAO(),
        PATCH_FIELDS,
        UPDATE_FIELDS);
    supportsSearch = true;
  }

  @Override
  public void setFields(InstanceCode entity, Fields fields, RelationIncludes relationIncludes) {
    /* No relationship fields to set */
  }

  @Override
  public void clearFields(InstanceCode entity, Fields fields) {
    /* No relationship fields to clear */
  }

  @Override
  public void prepare(InstanceCode entity, boolean update) {
    /* Nothing to validate beyond schema constraints */
  }

  @Override
  public void storeEntity(InstanceCode entity, boolean update) {
    store(entity, update);
  }

  @Override
  public void storeRelationships(InstanceCode entity) {
    /* No relationships to store */
  }

  @Override
  public EntityRepository<InstanceCode>.EntityUpdater getUpdater(
      InstanceCode original, InstanceCode updated, Operation operation, ChangeSource changeSource) {
    return new InstanceCodeUpdater(original, updated, operation);
  }

  public class InstanceCodeUpdater extends EntityUpdater {
    public InstanceCodeUpdater(InstanceCode original, InstanceCode updated, Operation operation) {
      super(original, updated, operation);
    }

    @Transaction
    @Override
    public void entitySpecificUpdate(boolean consolidatingChanges) {
      compareAndUpdate(
          "codeGroup",
          () ->
              recordChangeIfDifferent(
                  "codeGroup", original.getCodeGroup(), updated.getCodeGroup()));
      compareAndUpdate(
          "codeGroupName",
          () ->
              recordChangeIfDifferent(
                  "codeGroupName", original.getCodeGroupName(), updated.getCodeGroupName()));
      compareAndUpdate(
          "codeValue",
          () ->
              recordChangeIfDifferent(
                  "codeValue", original.getCodeValue(), updated.getCodeValue()));
      compareAndUpdate(
          "codeName",
          () -> recordChangeIfDifferent("codeName", original.getCodeName(), updated.getCodeName()));
      compareAndUpdate(
          "sortOrder",
          () ->
              recordChangeIfDifferent(
                  "sortOrder", original.getSortOrder(), updated.getSortOrder()));
      compareAndUpdate(
          "registeredDate",
          () ->
              recordChangeIfDifferent(
                  "registeredDate", original.getRegisteredDate(), updated.getRegisteredDate()));
      compareAndUpdate(
          "active",
          () -> recordChangeIfDifferent("active", original.getActive(), updated.getActive()));
    }

    private void recordChangeIfDifferent(String field, Object origValue, Object updatedValue) {
      if (!Objects.equals(origValue, updatedValue)) {
        recordChange(field, origValue, updatedValue);
      }
    }
  }
}
