package org.openmetadata.service.resources.data;

import org.openmetadata.schema.api.data.CreateReportProject;
import org.openmetadata.schema.entity.data.ReportProject;
import org.openmetadata.service.mapper.EntityMapper;

public class ReportProjectMapperKbCust implements EntityMapper<ReportProject, CreateReportProject> {
  @Override
  public ReportProject createToEntity(CreateReportProject create, String user) {
    return copy(new ReportProject(), create, user)
        .withType(create.getType())
        .withQueries(create.getQueries())
        .withRequestDeptKbCust(create.getRequestDeptKbCust())
        .withRequestEmployeeKbCust(create.getRequestEmployeeKbCust())
        .withItOwnerDeptKbCust(create.getItOwnerDeptKbCust())
        .withItOwnerEmployeeKbCust(create.getItOwnerEmployeeKbCust())
        .withRequestDateKbCust(create.getRequestDateKbCust());
  }
}
