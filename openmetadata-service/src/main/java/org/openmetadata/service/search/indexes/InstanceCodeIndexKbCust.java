package org.openmetadata.service.search.indexes;

import java.util.Map;
import org.openmetadata.schema.entity.data.InstanceCode;
import org.openmetadata.service.Entity;

public record InstanceCodeIndexKbCust(InstanceCode instanceCode) implements SearchIndex {

  @Override
  public Object getEntity() {
    return instanceCode;
  }

  @Override
  public String getEntityTypeName() {
    return Entity.INSTANCE_CODE;
  }

  public Map<String, Object> buildSearchIndexDocInternal(Map<String, Object> esDoc) {
    return esDoc;
  }
}
