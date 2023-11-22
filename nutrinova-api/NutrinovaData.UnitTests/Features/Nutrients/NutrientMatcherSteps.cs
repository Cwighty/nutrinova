using NutrinovaData.Features.Nutrients;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace NutrinovaData.UnitTests.Features.Nutrients;

[Binding]
public class NutrientMatcherSteps
{
  private readonly ScenarioContext scenarioContext;

  public NutrientMatcherSteps(ScenarioContext scenarioContext)
  {
    this.scenarioContext = scenarioContext;
  }

  [Given("The description of an imported nutrient is (.*)")]
  public void GivenTheDescriptionOfAnImportedNutrientIs(string importedDescription)
  {
    scenarioContext["ImportedDescription"] = importedDescription;
  }

  [Given("We are tracking these nutrients in our system")]
  public void GivenWeAreTrackingTheseNutrientsInOurSystem(Table table)
  {
    var options = table.CreateSet<NutrientOption>().ToList();
    var matcher = new CosineDistanceNutrientMatcher(options);
    scenarioContext.Add("NutrientMatcher", matcher);
  }

  [When("Matching the nutrient to ours")]
  public void WhenMatchingTheNutrientToOurs()
  {
    string importedDescription = scenarioContext.Get<string>("ImportedDescription");
    var matcher = scenarioContext.Get<INutrientMatcher>("NutrientMatcher");

    try
    {
      var expectedNutrient = matcher.FindClosestMatch(importedDescription);
      scenarioContext["ExpectedNutrientId"] = expectedNutrient.Id;
    }
    catch (Exception ex)
    {
      scenarioContext["MatchingException"] = ex;
    }
  }

  [Then("The closest match should be (.*)")]
  public void ThenTheClosestMatchShouldBe(int expectedNutrientId)
  {
    int actualNutrientId = scenarioContext.Get<int>("ExpectedNutrientId");
    Assert.That(actualNutrientId, Is.EqualTo(expectedNutrientId));
  }

  [Then("Matching throws error \"(.*)\"")]
  public void ThenMatchingThrowsError(string expectedErrorMessage)
  {
    var matchingException = scenarioContext.Get<Exception>("MatchingException");
    Assert.That(matchingException, Is.Not.Null);
    Assert.True(matchingException.Message.Contains(expectedErrorMessage));
  }
}
