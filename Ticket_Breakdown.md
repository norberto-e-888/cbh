# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

Ticket 1:

- Title: Implement correlation table "ExternalAgentReference"
- Estimated Effort: 1hr
- Acceptance Criteria
  - The table needs 3 columns: AgentID, FacilityID, ExternalReference
  - Uses a composite PK of (AgentID, FacilityID)
  - ExternalReference column is of type VarChar(64)

Ticket 2:

- Title: Expose a REST API for Facility Admins to create and delete their own references to agents
- Estimated Effort: 2hrs
- Acceptance Criteria
  - Expose **/agent/:id/external-reference POST**
    - Check agent with ID ":id" exists, return a 404 otherwise
    - Expect and validate body of type `{ customId: string }` (only validate that "customId" is a non-empty string)
    - Read the value of FacilityID from the incoming JWT payload. Expect the shape of the JWT payload to be a superset of `{ app_metadata: { facilityId: string } }`
    - To recap: The 3 values you need to insert a row are -> AgentID (read from url), ExternalReference (read from body), FacilityID (read from Auth0's JWT payload app_metadata)
  - Expose **/agent/:id/external-reference DELETE**
    - Check agent with ID ":id" exists, return a 404 otherwise
    - Expect no body
    - Read the value of FacilityID from the incoming JWT payload. Expect the shape of the JWT payload to be a superset of `{ app_metadata: { facilityId: string } }`
    - To recap: The 2 values you need to generate the PK of the row to delete are -> AgentID (read from url), FacilityID (read from Auth0's JWT payload app_metadata)
- Notes:
  - By ":id" we're referring to the internal ID
  - Restrict both endpoints to the "FacilityAdmin" role

Ticket 3:

- Title: Modify `getShiftsByFacility` to support "withCustomAgentIds" option
- Estimated Effort: 1.5hr
- Acceptance Criteria
  - Extend the options of `getShiftsByFacility` to include a new key of boolean value "withCustomAgentIds". Have it default to `false`
  - If "withCustomAgentIds" is `true` read all rows on the new table "ExternalAgentReference" WHERE FacilityID = the facility ID passed to `getShiftsByFacility`, and create a hash map where keys are `AgentID` and values are their corresponding `ExternalReference`. Within each agent aggregation, set under key "externalAgentReference" the value held by the in-memory hash map using the agent's internal ID as key.
