Feature: News page

  @mockserver
  Example: On load
    Given the endpoint "/api/tide/page" with query "?path=/sample-news&site=8888" returns fixture "/news/sample-news" with status 200
    And the endpoint "/api/tide/site" with query "?id=8888" returns fixture "/site/reference" with status 200
    Given I visit the page "/sample-news"
    Then the title should be "Sample News"

  Example: Details
    And the news page details should include "Melbourne metropolitan, Eastern metropolitan Melbourne"
    And the news page details should include "DPC"

  Example: Body
    And the news page should display the featured image "Image of tram"
    Then a wysiwyg content area with ID "969" should exist with the content "Here is some sample rich text content"
