package org.openmetadata.service.search.indexes;

import java.util.Map;
import org.openmetadata.schema.entity.data.ReportProject;
import org.openmetadata.service.Entity;

public record ReportProjectIndexKbCust(ReportProject reportProject) implements SearchIndex {

  @Override
  public Object getEntity() {
    return reportProject;
  }

  @Override
  public String getEntityTypeName() {
    return Entity.REPORT_PROJECT;
  }

  public Map<String, Object> buildSearchIndexDocInternal(Map<String, Object> esDoc) {
    return esDoc;
  }
}
