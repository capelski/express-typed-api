Feature: Publish api

   The publishApi method exposes the endpoints defined via the received parameter,
   by calling the corresponding express app methods

   Scenario: Simple endpoint handler
      Given a new express app
      And the API definition in "simple-endpoint-handlers"
      When calling publishApi
      Then the express app "get" method is called with "/api/sample" and handler "A"
      And the express app "post" method is called with "/api/sample" and handler "B"
      And the express app "put" method is called with "/api/sample" and handler "C"
      And the express app "delete" method is called with "/api/sample" and handler "D"
      And the express app "patch" method is called with "/api/sample" and handler "E"
      And the following published endpoints list is returned
         | /api/sample | get    | A   |
         | /api/sample | post   | B   |
         | /api/sample | put    | C   |
         | /api/sample | delete | D   |
         | /api/sample | patch  | E   |

   Scenario: Invalid endpoint handler
      Given a new express app
      And the API definition in "invalid-method"
      When calling publishApi
      Then no method is called on the express app
      And no published endpoints are returned

   Scenario: Endpoint handler with middleware
      Given a new express app
      And the API definition in "middleware-endpoint-handler"
      When calling publishApi
      Then the express app "post" method is called with "/api/sample" and handlers "jsonParser,A"
      And the following published endpoints list is returned
         | /api/sample | post    | jsonParser,A  |

   Scenario: Endpoints handlers with prefixed path
      Given a new express app
      And the API definition in "simple-endpoint-handlers"
      When calling publishApi with "/v1" prefix
      Then the express app "get" method is called with "/v1/api/sample" and handler "A"
      And the following published endpoints list is returned
         | /v1/api/sample | get    | A   |
         | /v1/api/sample | post   | B   |
         | /v1/api/sample | put    | C   |
         | /v1/api/sample | delete | D   |
         | /v1/api/sample | patch  | E   |

