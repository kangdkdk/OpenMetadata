package org.openmetadata.service.resources.data;

import io.dropwizard.jersey.PATCH;
import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.json.JsonPatch;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.openmetadata.schema.api.data.CreateReportProject;
import org.openmetadata.schema.entity.data.ReportProject;
import org.openmetadata.schema.type.EntityHistory;
import org.openmetadata.schema.type.Include;
import org.openmetadata.schema.utils.ResultList;
import org.openmetadata.service.Entity;
import org.openmetadata.service.jdbi3.ListFilter;
import org.openmetadata.service.jdbi3.ReportProjectRepositoryKbCust;
import org.openmetadata.service.limits.Limits;
import org.openmetadata.service.resources.Collection;
import org.openmetadata.service.resources.EntityResource;
import org.openmetadata.service.security.Authorizer;

@Slf4j
@Path("/v1/reportProjects")
@Tag(
    name = "Report Projects",
    description =
        "A `ReportProject` groups a set of saved queries against one or more services, "
            + "run on a recurring schedule.")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Collection(name = "reportProjects")
public class ReportProjectResourceKbCust
    extends EntityResource<ReportProject, ReportProjectRepositoryKbCust> {
  private final ReportProjectMapperKbCust mapper = new ReportProjectMapperKbCust();
  public static final String COLLECTION_PATH = "/v1/reportProjects";
  static final String FIELDS = "";

  public ReportProjectResourceKbCust(Authorizer authorizer, Limits limits) {
    super(Entity.REPORT_PROJECT, authorizer, limits);
  }

  public static class ReportProjectList extends ResultList<ReportProject> {
    /* Required for serde */
  }

  @GET
  @Valid
  @Operation(
      operationId = "listReportProjects",
      summary = "List report projects",
      description =
          "Get a list of report projects. Use cursor-based pagination to limit the number "
              + "entries in the list using `limit` and `before` or `after` query params.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "List of report projects",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ReportProjectList.class)))
      })
  public ResultList<ReportProject> list(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(
              description = "Fields requested in the returned resource",
              schema = @Schema(type = "string", example = FIELDS))
          @QueryParam("fields")
          String fieldsParam,
      @Parameter(
              description =
                  "Limit the number of report projects returned. (1 to 1000000, default = 10)")
          @DefaultValue("10")
          @Min(value = 0, message = "must be greater than or equal to 0")
          @Max(value = 1000000, message = "must be less than or equal to 1000000")
          @QueryParam("limit")
          int limitParam,
      @Parameter(description = "Returns list of report projects before this cursor")
          @QueryParam("before")
          String before,
      @Parameter(description = "Returns list of report projects after this cursor")
          @QueryParam("after")
          String after) {
    return super.listInternal(
        uriInfo, securityContext, fieldsParam, new ListFilter(null), limitParam, before, after);
  }

  @GET
  @Path("/{id}/versions")
  @Operation(
      operationId = "listAllReportProjectVersion",
      summary = "List ReportProject versions",
      description = "Get a list of all the versions of a report project identified by `id`",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "List of report project versions",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = EntityHistory.class)))
      })
  public EntityHistory listVersions(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(description = "Id of the ReportProject", schema = @Schema(type = "UUID"))
          @PathParam("id")
          UUID id) {
    return super.listVersionsInternal(securityContext, id);
  }

  @GET
  @Valid
  @Path("/{id}")
  @Operation(
      operationId = "getReportProjectByID",
      summary = "Get a report project by id",
      description = "Get a report project by `id`.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "The ReportProject",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ReportProject.class))),
        @ApiResponse(
            responseCode = "404",
            description = "ReportProject for instance {id} is not found")
      })
  public ReportProject get(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(description = "Id of the ReportProject", schema = @Schema(type = "UUID"))
          @PathParam("id")
          UUID id,
      @Parameter(
              description = "Fields requested in the returned resource",
              schema = @Schema(type = "string", example = FIELDS))
          @QueryParam("fields")
          String fieldsParam,
      @Parameter(
              description = "Include all, deleted, or non-deleted entities.",
              schema = @Schema(implementation = Include.class))
          @QueryParam("include")
          @DefaultValue("non-deleted")
          Include include) {
    return getInternal(uriInfo, securityContext, id, fieldsParam, include);
  }

  @GET
  @Valid
  @Path("/name/{name}")
  @Operation(
      operationId = "getReportProjectByFQN",
      summary = "Get a ReportProject by name",
      description = "Get a ReportProject by `name`.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "The ReportProject",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ReportProject.class))),
        @ApiResponse(
            responseCode = "404",
            description = "ReportProject for instance {name} is not found")
      })
  public ReportProject getByName(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(description = "Name of the ReportProject", schema = @Schema(type = "string"))
          @PathParam("name")
          String name,
      @Parameter(
              description = "Fields requested in the returned resource",
              schema = @Schema(type = "string", example = FIELDS))
          @QueryParam("fields")
          String fieldsParam,
      @Parameter(
              description = "Include all, deleted, or non-deleted entities.",
              schema = @Schema(implementation = Include.class))
          @QueryParam("include")
          @DefaultValue("non-deleted")
          Include include) {
    return getByNameInternal(uriInfo, securityContext, name, fieldsParam, include);
  }

  @POST
  @Operation(
      operationId = "createReportProject",
      summary = "Create a ReportProject",
      description = "Create a new ReportProject.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "The ReportProject.",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ReportProject.class))),
        @ApiResponse(responseCode = "400", description = "Bad request")
      })
  public Response create(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Valid CreateReportProject create) {
    ReportProject reportProject =
        mapper.createToEntity(create, securityContext.getUserPrincipal().getName());
    return create(uriInfo, securityContext, reportProject);
  }

  @PUT
  @Operation(
      operationId = "createOrUpdateReportProject",
      summary = "Update ReportProject",
      description = "Create or Update a ReportProject.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "The ReportProject.",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ReportProject.class))),
        @ApiResponse(responseCode = "400", description = "Bad request")
      })
  public Response createOrUpdate(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Valid CreateReportProject create) {
    ReportProject reportProject =
        mapper.createToEntity(create, securityContext.getUserPrincipal().getName());
    return createOrUpdate(uriInfo, securityContext, reportProject);
  }

  @PATCH
  @Path("/{id}")
  @Consumes(MediaType.APPLICATION_JSON_PATCH_JSON)
  @Operation(
      operationId = "patchReportProject",
      summary = "Update a ReportProject",
      description = "Update an existing report project with JsonPatch.",
      externalDocs =
          @ExternalDocumentation(
              description = "JsonPatch RFC",
              url = "https://tools.ietf.org/html/rfc6902"))
  public Response patch(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(description = "Id of the ReportProject", schema = @Schema(type = "UUID"))
          @PathParam("id")
          UUID id,
      @RequestBody(
              description = "JsonPatch with array of operations",
              content =
                  @Content(
                      mediaType = MediaType.APPLICATION_JSON_PATCH_JSON,
                      examples = {
                        @ExampleObject("[{op:remove, path:/a},{op:add, path: /b, value: val}]")
                      }))
          JsonPatch patch) {
    return patchInternal(uriInfo, securityContext, id, patch);
  }

  @DELETE
  @Path("/{id}")
  @Operation(
      operationId = "deleteReportProject",
      summary = "Delete a ReportProject by id",
      description = "Delete a ReportProject by given `id`.",
      responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(
            responseCode = "404",
            description = "ReportProject for instance {id} is not found")
      })
  public Response delete(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(description = "Id of the ReportProject", schema = @Schema(type = "UUID"))
          @PathParam("id")
          UUID id) {
    return delete(uriInfo, securityContext, id, false, true);
  }

  @DELETE
  @Path("/name/{name}")
  @Operation(
      operationId = "deleteReportProjectByName",
      summary = "Delete a ReportProject by name",
      description = "Delete a ReportProject by given `name`.",
      responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(
            responseCode = "404",
            description = "ReportProject for instance {name} is not found")
      })
  public Response delete(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(description = "Name of the ReportProject", schema = @Schema(type = "string"))
          @PathParam("name")
          String name) {
    return deleteByName(uriInfo, securityContext, name, false, true);
  }
}
