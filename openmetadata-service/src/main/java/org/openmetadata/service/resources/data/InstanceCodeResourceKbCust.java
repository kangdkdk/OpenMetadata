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
import org.openmetadata.schema.api.data.CreateInstanceCode;
import org.openmetadata.schema.entity.data.InstanceCode;
import org.openmetadata.schema.type.EntityHistory;
import org.openmetadata.schema.type.Include;
import org.openmetadata.schema.utils.ResultList;
import org.openmetadata.service.Entity;
import org.openmetadata.service.jdbi3.InstanceCodeRepositoryKbCust;
import org.openmetadata.service.jdbi3.ListFilter;
import org.openmetadata.service.limits.Limits;
import org.openmetadata.service.resources.Collection;
import org.openmetadata.service.resources.EntityResource;
import org.openmetadata.service.security.Authorizer;

@Slf4j
@Path("/v1/instanceCodes")
@Tag(
    name = "Instance Codes",
    description = "An `InstanceCode` is a single code value belonging to a named code group.")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Collection(name = "instanceCodes")
public class InstanceCodeResourceKbCust
    extends EntityResource<InstanceCode, InstanceCodeRepositoryKbCust> {
  private final InstanceCodeMapperKbCust mapper = new InstanceCodeMapperKbCust();
  public static final String COLLECTION_PATH = "/v1/instanceCodes";
  static final String FIELDS = "";

  public InstanceCodeResourceKbCust(Authorizer authorizer, Limits limits) {
    super(Entity.INSTANCE_CODE, authorizer, limits);
  }

  public static class InstanceCodeList extends ResultList<InstanceCode> {
    /* Required for serde */
  }

  @GET
  @Valid
  @Operation(
      operationId = "listInstanceCodes",
      summary = "List instance codes",
      description =
          "Get a list of instance codes. Use cursor-based pagination to limit the number "
              + "entries in the list using `limit` and `before` or `after` query params.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "List of instance codes",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = InstanceCodeList.class)))
      })
  public ResultList<InstanceCode> list(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(
              description = "Fields requested in the returned resource",
              schema = @Schema(type = "string", example = FIELDS))
          @QueryParam("fields")
          String fieldsParam,
      @Parameter(
              description =
                  "Limit the number of instance codes returned. (1 to 1000000, default = 10)")
          @DefaultValue("10")
          @Min(value = 0, message = "must be greater than or equal to 0")
          @Max(value = 1000000, message = "must be less than or equal to 1000000")
          @QueryParam("limit")
          int limitParam,
      @Parameter(description = "Returns list of instance codes before this cursor")
          @QueryParam("before")
          String before,
      @Parameter(description = "Returns list of instance codes after this cursor")
          @QueryParam("after")
          String after) {
    return super.listInternal(
        uriInfo, securityContext, fieldsParam, new ListFilter(null), limitParam, before, after);
  }

  @GET
  @Path("/{id}/versions")
  @Operation(
      operationId = "listAllInstanceCodeVersion",
      summary = "List InstanceCode versions",
      description = "Get a list of all the versions of an instance code identified by `id`",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "List of instance code versions",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = EntityHistory.class)))
      })
  public EntityHistory listVersions(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(description = "Id of the InstanceCode", schema = @Schema(type = "UUID"))
          @PathParam("id")
          UUID id) {
    return super.listVersionsInternal(securityContext, id);
  }

  @GET
  @Valid
  @Path("/{id}")
  @Operation(
      operationId = "getInstanceCodeByID",
      summary = "Get an instance code by id",
      description = "Get an instance code by `id`.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "The InstanceCode",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = InstanceCode.class))),
        @ApiResponse(
            responseCode = "404",
            description = "InstanceCode for instance {id} is not found")
      })
  public InstanceCode get(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(description = "Id of the InstanceCode", schema = @Schema(type = "UUID"))
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
      operationId = "getInstanceCodeByFQN",
      summary = "Get an InstanceCode by name",
      description = "Get an InstanceCode by `name`.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "The InstanceCode",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = InstanceCode.class))),
        @ApiResponse(
            responseCode = "404",
            description = "InstanceCode for instance {name} is not found")
      })
  public InstanceCode getByName(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(description = "Name of the InstanceCode", schema = @Schema(type = "string"))
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
      operationId = "createInstanceCode",
      summary = "Create an InstanceCode",
      description = "Create a new InstanceCode.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "The InstanceCode.",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = InstanceCode.class))),
        @ApiResponse(responseCode = "400", description = "Bad request")
      })
  public Response create(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Valid CreateInstanceCode create) {
    InstanceCode instanceCode =
        mapper.createToEntity(create, securityContext.getUserPrincipal().getName());
    return create(uriInfo, securityContext, instanceCode);
  }

  @PUT
  @Operation(
      operationId = "createOrUpdateInstanceCode",
      summary = "Update InstanceCode",
      description = "Create or Update an InstanceCode.",
      responses = {
        @ApiResponse(
            responseCode = "200",
            description = "The InstanceCode.",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = InstanceCode.class))),
        @ApiResponse(responseCode = "400", description = "Bad request")
      })
  public Response createOrUpdate(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Valid CreateInstanceCode create) {
    InstanceCode instanceCode =
        mapper.createToEntity(create, securityContext.getUserPrincipal().getName());
    return createOrUpdate(uriInfo, securityContext, instanceCode);
  }

  @PATCH
  @Path("/{id}")
  @Consumes(MediaType.APPLICATION_JSON_PATCH_JSON)
  @Operation(
      operationId = "patchInstanceCode",
      summary = "Update an InstanceCode",
      description = "Update an existing instance code with JsonPatch.",
      externalDocs =
          @ExternalDocumentation(
              description = "JsonPatch RFC",
              url = "https://tools.ietf.org/html/rfc6902"))
  public Response patch(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(description = "Id of the InstanceCode", schema = @Schema(type = "UUID"))
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
      operationId = "deleteInstanceCode",
      summary = "Delete an InstanceCode by id",
      description = "Delete an InstanceCode by given `id`.",
      responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(
            responseCode = "404",
            description = "InstanceCode for instance {id} is not found")
      })
  public Response delete(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(description = "Id of the InstanceCode", schema = @Schema(type = "UUID"))
          @PathParam("id")
          UUID id) {
    return delete(uriInfo, securityContext, id, false, true);
  }

  @DELETE
  @Path("/name/{name}")
  @Operation(
      operationId = "deleteInstanceCodeByName",
      summary = "Delete an InstanceCode by name",
      description = "Delete an InstanceCode by given `name`.",
      responses = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(
            responseCode = "404",
            description = "InstanceCode for instance {name} is not found")
      })
  public Response delete(
      @Context UriInfo uriInfo,
      @Context SecurityContext securityContext,
      @Parameter(description = "Name of the InstanceCode", schema = @Schema(type = "string"))
          @PathParam("name")
          String name) {
    return deleteByName(uriInfo, securityContext, name, false, true);
  }
}
