﻿// ------------------------------------------------------------------------------
//  <auto-generated>
//      This code was generated by SpecFlow (https://www.specflow.org/).
//      SpecFlow Version:3.9.0.0
//      SpecFlow Generator Version:3.9.0.0
// 
//      Changes to this file may cause incorrect behavior and will be lost if
//      the code is regenerated.
//  </auto-generated>
// ------------------------------------------------------------------------------
#region Designer generated code
#pragma warning disable
namespace NutrinovaData.UnitTests.Features.Recipes
{
  using TechTalk.SpecFlow;
  using System;
  using System.Linq;


  [System.CodeDom.Compiler.GeneratedCodeAttribute("TechTalk.SpecFlow", "3.9.0.0")]
  [System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
  [NUnit.Framework.TestFixtureAttribute()]
  [NUnit.Framework.DescriptionAttribute("RecipeFoodTotaler")]
  public partial class RecipeFoodTotalerFeature
  {

    private TechTalk.SpecFlow.ITestRunner testRunner;

    private static string[] featureTags = ((string[])(null));

#line 1 "RecipeFoodTotaler.feature"
#line hidden
        
        [NUnit.Framework.OneTimeSetUpAttribute()]
        public virtual void FeatureSetup()
        {
            testRunner = TechTalk.SpecFlow.TestRunnerManager.GetTestRunner();
            TechTalk.SpecFlow.FeatureInfo featureInfo = new TechTalk.SpecFlow.FeatureInfo(new System.Globalization.CultureInfo("en-US"), "Features/Recipes", "RecipeFoodTotaler", "    In order to get accurate nutrient summaries\n    As a nutrition analyst\n    I " +
                    "want to be able to total nutrients from various recipe foods", ProgrammingLanguage.CSharp, featureTags);
            testRunner.OnFeatureStart(featureInfo);
        }
        
        [NUnit.Framework.OneTimeTearDownAttribute()]
        public virtual void FeatureTearDown()
        {
            testRunner.OnFeatureEnd();
            testRunner = null;
        }
        
        [NUnit.Framework.SetUpAttribute()]
        public void TestInitialize()
        {
        }
        
        [NUnit.Framework.TearDownAttribute()]
        public void TestTearDown()
        {
            testRunner.OnScenarioEnd();
        }
        
        public void ScenarioInitialize(TechTalk.SpecFlow.ScenarioInfo scenarioInfo)
        {
            testRunner.OnScenarioInitialize(scenarioInfo);
            testRunner.ScenarioContext.ScenarioContainer.RegisterInstanceAs<NUnit.Framework.TestContext>(NUnit.Framework.TestContext.CurrentContext);
        }
        
        public void ScenarioStart()
        {
            testRunner.OnScenarioStart();
        }
        
        public void ScenarioCleanup()
        {
            testRunner.CollectScenarioErrors();
        }
        
        [NUnit.Framework.TestAttribute()]
        [NUnit.Framework.DescriptionAttribute("Total nutrients from a list of recipe foods")]
        [NUnit.Framework.CategoryAttribute("GetNutrientSummaries")]
        public void TotalNutrientsFromAListOfRecipeFoods()
        {
            string[] tagsOfScenario = new string[] {
                    "GetNutrientSummaries"};
      System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new System.Collections.Specialized.OrderedDictionary();
      TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Total nutrients from a list of recipe foods", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 7
      this.ScenarioInitialize(scenarioInfo);
#line hidden
      if ((TagHelper.ContainsIgnoreTag(tagsOfScenario) || TagHelper.ContainsIgnoreTag(featureTags)))
      {
        testRunner.SkipScenario();
      }
      else
      {
        this.ScenarioStart();
#line 8
        testRunner.Given("a recipe food totaler", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Given ");
#line hidden
        TechTalk.SpecFlow.Table table3 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description"});
        table3.AddRow(new string[] {
                            "1",
                            "Solid"});
        table3.AddRow(new string[] {
                            "2",
                            "Liquid"});
        table3.AddRow(new string[] {
                            "3",
                            "Quantity"});
#line 9
        testRunner.And("the following Unit Categories", ((string)(null)), table3, "And ");
#line hidden
        TechTalk.SpecFlow.Table table4 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description",
                            "CategoryId"});
        table4.AddRow(new string[] {
                            "1",
                            "gram",
                            "1"});
        table4.AddRow(new string[] {
                            "2",
                            "milliliter",
                            "2"});
#line 14
        testRunner.And("the following units", ((string)(null)), table4, "And ");
#line hidden
        TechTalk.SpecFlow.Table table5 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description"});
        table5.AddRow(new string[] {
                            "1",
                            "Vitamin C"});
        table5.AddRow(new string[] {
                            "2",
                            "Potassium"});
#line 18
        testRunner.And("the following nutrients", ((string)(null)), table5, "And ");
#line hidden
        TechTalk.SpecFlow.Table table6 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description",
                            "ServingSize",
                            "ServingSizeUnit"});
        table6.AddRow(new string[] {
                            "1",
                            "Apple",
                            "10",
                            "1"});
#line 22
        testRunner.And("the following foods", ((string)(null)), table6, "And ");
#line hidden
        TechTalk.SpecFlow.Table table7 = new TechTalk.SpecFlow.Table(new string[] {
                            "FoodplanId",
                            "NutrientId",
                            "Amount",
                            "UnitId"});
        table7.AddRow(new string[] {
                            "1",
                            "1",
                            "10",
                            "1"});
        table7.AddRow(new string[] {
                            "1",
                            "2",
                            "5",
                            "1"});
#line 25
        testRunner.And("the following food nutrients", ((string)(null)), table7, "And ");
#line hidden
        TechTalk.SpecFlow.Table table8 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description"});
        table8.AddRow(new string[] {
                            "1",
                            "Apple Pie"});
#line 29
        testRunner.And("the following recipes", ((string)(null)), table8, "And ");
#line hidden
        TechTalk.SpecFlow.Table table9 = new TechTalk.SpecFlow.Table(new string[] {
                            "RecipeId",
                            "FoodId",
                            "Amount",
                            "UnitId"});
        table9.AddRow(new string[] {
                            "1",
                            "1",
                            "2",
                            "1"});
        table9.AddRow(new string[] {
                            "1",
                            "2",
                            "3",
                            "1"});
#line 32
        testRunner.And("the following recipe foods", ((string)(null)), table9, "And ");
#line hidden
        TechTalk.SpecFlow.Table table10 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "FoodPlanId",
                            "FoodServingsPerMeasurement",
                            "MeasurementUnitId"});
#line 36
        testRunner.And("the following food conversion samples", ((string)(null)), table10, "And ");
#line hidden
#line 38
        testRunner.When("I calculate nutrient summaries", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
        TechTalk.SpecFlow.Table table11 = new TechTalk.SpecFlow.Table(new string[] {
                            "Name",
                            "Amount"});
        table11.AddRow(new string[] {
                            "Vitamin C",
                            "2"});
        table11.AddRow(new string[] {
                            "Potassium",
                            "1"});
#line 39
        testRunner.Then("the nutrient summaries should be", ((string)(null)), table11, "Then ");
#line hidden
      }
      this.ScenarioCleanup();
    }

    [NUnit.Framework.TestAttribute()]
    [NUnit.Framework.DescriptionAttribute("Total nutrients from a list of recipe foods with different units")]
    public void TotalNutrientsFromAListOfRecipeFoodsWithDifferentUnits()
    {
      string[] tagsOfScenario = ((string[])(null));
      System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new System.Collections.Specialized.OrderedDictionary();
      TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Total nutrients from a list of recipe foods with different units", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 44
      this.ScenarioInitialize(scenarioInfo);
#line hidden
      if ((TagHelper.ContainsIgnoreTag(tagsOfScenario) || TagHelper.ContainsIgnoreTag(featureTags)))
      {
        testRunner.SkipScenario();
      }
      else
      {
        this.ScenarioStart();
#line 45
        testRunner.Given("a recipe food totaler", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Given ");
#line hidden
        TechTalk.SpecFlow.Table table12 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description"});
        table12.AddRow(new string[] {
                            "1",
                            "Solid"});
        table12.AddRow(new string[] {
                            "2",
                            "Liquid"});
        table12.AddRow(new string[] {
                            "3",
                            "Quantity"});
#line 46
        testRunner.And("the following Unit Categories", ((string)(null)), table12, "And ");
#line hidden
        TechTalk.SpecFlow.Table table13 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description",
                            "CategoryId"});
        table13.AddRow(new string[] {
                            "1",
                            "gram",
                            "1"});
        table13.AddRow(new string[] {
                            "2",
                            "milliliter",
                            "2"});
        table13.AddRow(new string[] {
                            "3",
                            "qty",
                            "3"});
#line 51
        testRunner.And("the following units", ((string)(null)), table13, "And ");
#line hidden
        TechTalk.SpecFlow.Table table14 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description"});
        table14.AddRow(new string[] {
                            "1",
                            "Vitamin C"});
        table14.AddRow(new string[] {
                            "2",
                            "Potassium"});
        table14.AddRow(new string[] {
                            "3",
                            "Sugar"});
        table14.AddRow(new string[] {
                            "4",
                            "Protein"});
#line 56
        testRunner.And("the following nutrients", ((string)(null)), table14, "And ");
#line hidden
        TechTalk.SpecFlow.Table table15 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description",
                            "ServingSize",
                            "ServingSizeUnit"});
        table15.AddRow(new string[] {
                            "1",
                            "Apple",
                            "150",
                            "1"});
#line 62
        testRunner.And("the following foods", ((string)(null)), table15, "And ");
#line hidden
        TechTalk.SpecFlow.Table table16 = new TechTalk.SpecFlow.Table(new string[] {
                            "FoodplanId",
                            "NutrientId",
                            "Amount",
                            "UnitId"});
        table16.AddRow(new string[] {
                            "1",
                            "1",
                            "0.0084",
                            "1"});
        table16.AddRow(new string[] {
                            "1",
                            "2",
                            "0.195",
                            "1"});
#line 65
        testRunner.And("the following food nutrients", ((string)(null)), table16, "And ");
#line hidden
        TechTalk.SpecFlow.Table table17 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description"});
        table17.AddRow(new string[] {
                            "1",
                            "Apple Pie"});
        table17.AddRow(new string[] {
                            "2",
                            "Blended Smore Clusters"});
#line 69
        testRunner.And("the following recipes", ((string)(null)), table17, "And ");
#line hidden
        TechTalk.SpecFlow.Table table18 = new TechTalk.SpecFlow.Table(new string[] {
                            "RecipeId",
                            "FoodId",
                            "Amount",
                            "UnitId"});
        table18.AddRow(new string[] {
                            "1",
                            "1",
                            "10",
                            "3"});
#line 73
        testRunner.And("the following recipe foods", ((string)(null)), table18, "And ");
#line hidden
        TechTalk.SpecFlow.Table table19 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "FoodPlanId",
                            "FoodServingsPerMeasurement",
                            "MeasurementUnitId"});
        table19.AddRow(new string[] {
                            "1",
                            "1",
                            "150",
                            "3"});
#line 76
        testRunner.And("the following food conversion samples", ((string)(null)), table19, "And ");
#line hidden
#line 79
        testRunner.When("I calculate nutrient summaries", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
        TechTalk.SpecFlow.Table table20 = new TechTalk.SpecFlow.Table(new string[] {
                            "Name",
                            "Amount"});
        table20.AddRow(new string[] {
                            "Vitamin C",
                            "0.084"});
        table20.AddRow(new string[] {
                            "Potassium",
                            "1.95"});
#line 80
        testRunner.Then("the nutrient summaries should be", ((string)(null)), table20, "Then ");
#line hidden
      }
      this.ScenarioCleanup();
    }

    [NUnit.Framework.TestAttribute()]
    [NUnit.Framework.DescriptionAttribute("Total nutrients from a list of recipe foods with different units 2")]
    public void TotalNutrientsFromAListOfRecipeFoodsWithDifferentUnits2()
    {
      string[] tagsOfScenario = ((string[])(null));
      System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new System.Collections.Specialized.OrderedDictionary();
      TechTalk.SpecFlow.ScenarioInfo scenarioInfo = new TechTalk.SpecFlow.ScenarioInfo("Total nutrients from a list of recipe foods with different units 2", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 85
      this.ScenarioInitialize(scenarioInfo);
#line hidden
      if ((TagHelper.ContainsIgnoreTag(tagsOfScenario) || TagHelper.ContainsIgnoreTag(featureTags)))
      {
        testRunner.SkipScenario();
      }
      else
      {
        this.ScenarioStart();
#line 86
        testRunner.Given("a recipe food totaler", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "Given ");
#line hidden
        TechTalk.SpecFlow.Table table21 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description"});
        table21.AddRow(new string[] {
                            "1",
                            "Solid"});
        table21.AddRow(new string[] {
                            "2",
                            "Liquid"});
        table21.AddRow(new string[] {
                            "3",
                            "Quantity"});
#line 87
        testRunner.And("the following Unit Categories", ((string)(null)), table21, "And ");
#line hidden
        TechTalk.SpecFlow.Table table22 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description",
                            "CategoryId"});
        table22.AddRow(new string[] {
                            "1",
                            "gram",
                            "1"});
        table22.AddRow(new string[] {
                            "2",
                            "milliliter",
                            "2"});
        table22.AddRow(new string[] {
                            "3",
                            "qty",
                            "3"});
#line 92
        testRunner.And("the following units", ((string)(null)), table22, "And ");
#line hidden
        TechTalk.SpecFlow.Table table23 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description"});
        table23.AddRow(new string[] {
                            "1",
                            "Vitamin C"});
        table23.AddRow(new string[] {
                            "2",
                            "Potassium"});
        table23.AddRow(new string[] {
                            "3",
                            "Sugar"});
        table23.AddRow(new string[] {
                            "4",
                            "Protein"});
#line 97
        testRunner.And("the following nutrients", ((string)(null)), table23, "And ");
#line hidden
        TechTalk.SpecFlow.Table table24 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description",
                            "ServingSize",
                            "ServingSizeUnit"});
        table24.AddRow(new string[] {
                            "2",
                            "Smore Cluster",
                            "1",
                            "3"});
#line 103
        testRunner.And("the following foods", ((string)(null)), table24, "And ");
#line hidden
        TechTalk.SpecFlow.Table table25 = new TechTalk.SpecFlow.Table(new string[] {
                            "FoodplanId",
                            "NutrientId",
                            "Amount",
                            "UnitId"});
        table25.AddRow(new string[] {
                            "2",
                            "3",
                            "12",
                            "1"});
        table25.AddRow(new string[] {
                            "2",
                            "4",
                            "1",
                            "1"});
#line 106
        testRunner.And("the following food nutrients", ((string)(null)), table25, "And ");
#line hidden
        TechTalk.SpecFlow.Table table26 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "Description"});
        table26.AddRow(new string[] {
                            "2",
                            "Blended Smore Clusters"});
#line 110
        testRunner.And("the following recipes", ((string)(null)), table26, "And ");
#line hidden
        TechTalk.SpecFlow.Table table27 = new TechTalk.SpecFlow.Table(new string[] {
                            "RecipeId",
                            "FoodId",
                            "Amount",
                            "UnitId"});
        table27.AddRow(new string[] {
                            "2",
                            "2",
                            "77",
                            "1"});
#line 113
        testRunner.And("the following recipe foods", ((string)(null)), table27, "And ");
#line hidden
        TechTalk.SpecFlow.Table table28 = new TechTalk.SpecFlow.Table(new string[] {
                            "Id",
                            "FoodPlanId",
                            "FoodServingsPerMeasurement",
                            "MeasurementUnitId"});
        table28.AddRow(new string[] {
                            "2",
                            "2",
                            "0.045",
                            "1"});
#line 116
        testRunner.And("the following food conversion samples", ((string)(null)), table28, "And ");
#line hidden
#line 119
        testRunner.When("I calculate nutrient summaries", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
        TechTalk.SpecFlow.Table table29 = new TechTalk.SpecFlow.Table(new string[] {
                            "Name",
                            "Amount"});
        table29.AddRow(new string[] {
                            "Sugar",
                            "41.58"});
        table29.AddRow(new string[] {
                            "Protien",
                            "3.5"});
#line 120
        testRunner.Then("the nutrient summaries should be", ((string)(null)), table29, "Then ");
#line hidden
      }
      this.ScenarioCleanup();
    }
  }
}
#pragma warning restore
#endregion
