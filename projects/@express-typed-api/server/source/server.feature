Feature: Publish api

   The publishApi method exposes the endpoints defined via the received parameter,
   by calling the corresponding express app methods

   Scenario: Valid endpoint handler
      Given an express app and an API definition
      And having an endpoint "A" with path "/api/sample" and method "get"
      And having an endpoint "B" with path "/api/sample" and method "post"
      And having an endpoint "C" with path "/api/sample" and method "put"
      And having an endpoint "D" with path "/api/sample" and method "delete"
      And having an endpoint "E" with path "/api/sample" and method "patch"
      When calling publishApi with the express app and the API definition
      Then the express app "get" method is called with "/api/sample" and endpoint "A"
      And the express app "post" method is called with "/api/sample" and endpoint "B"
      And the express app "put" method is called with "/api/sample" and endpoint "C"
      And the express app "delete" method is called with "/api/sample" and endpoint "D"
      And the express app "patch" method is called with "/api/sample" and endpoint "E"
      And the following published endpoints list is returned
         | /api/sample | get    |
         | /api/sample | post   |
         | /api/sample | put    |
         | /api/sample | delete |
         | /api/sample | patch  |

   Scenario: Invalid endpoint handler
      Given an express app and an API definition
      And having an endpoint "A" with path "/api/sample" and method "invalid"
      When calling publishApi with the express app and the API definition
      Then no method is called on the express app
      And no published endpoints are returned
