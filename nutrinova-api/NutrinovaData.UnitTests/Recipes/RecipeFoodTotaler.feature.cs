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
namespace NutrinovaData.UnitTests.Recipes
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
            TechTalk.SpecFlow.FeatureInfo featureInfo = new TechTalk.SpecFlow.FeatureInfo(new System.Globalization.CultureInfo("en-US"), "Recipes", "RecipeFoodTotaler", "    In order to get accurate nutrient summaries\r\n    As a nutrition analyst\r\n    " +
                    "I want to be able to total nutrients from various recipe foods", ProgrammingLanguage.CSharp, featureTags);
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
                TechTalk.SpecFlow.Table table1 = new TechTalk.SpecFlow.Table(new string[] {
                            "FoodId",
                            "Description"});
                table1.AddRow(new string[] {
                            "1",
                            "Apple"});
#line 8
 testRunner.Given("the following foods", ((string)(null)), table1, "Given ");
#line hidden
                TechTalk.SpecFlow.Table table2 = new TechTalk.SpecFlow.Table(new string[] {
                            "NutrientId",
                            "Description"});
                table2.AddRow(new string[] {
                            "1",
                            "Vitamin C"});
                table2.AddRow(new string[] {
                            "2",
                            "Potassium"});
#line 11
 testRunner.And("the following nutrients", ((string)(null)), table2, "And ");
#line hidden
                TechTalk.SpecFlow.Table table3 = new TechTalk.SpecFlow.Table(new string[] {
                            "UnitCategoryId",
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
#line 15
 testRunner.And("the following Unit Categories", ((string)(null)), table3, "And ");
#line hidden
                TechTalk.SpecFlow.Table table4 = new TechTalk.SpecFlow.Table(new string[] {
                            "UnitId",
                            "Description",
                            "UnitCategoryId"});
                table4.AddRow(new string[] {
                            "1",
                            "gram",
                            "1"});
                table4.AddRow(new string[] {
                            "2",
                            "milliliter",
                            "2"});
#line 20
 testRunner.And("the following units", ((string)(null)), table4, "And ");
#line hidden
                TechTalk.SpecFlow.Table table5 = new TechTalk.SpecFlow.Table(new string[] {
                            "FoodId",
                            "NutrientId",
                            "Amount",
                            "UnitId"});
                table5.AddRow(new string[] {
                            "1",
                            "1",
                            "10",
                            "1"});
                table5.AddRow(new string[] {
                            "1",
                            "2",
                            "5",
                            "1"});
#line 24
 testRunner.And("the following food nutrients", ((string)(null)), table5, "And ");
#line hidden
                TechTalk.SpecFlow.Table table6 = new TechTalk.SpecFlow.Table(new string[] {
                            "RecipeId",
                            "Description"});
                table6.AddRow(new string[] {
                            "1",
                            "Apple Pie"});
#line 28
 testRunner.And("the following recipes", ((string)(null)), table6, "And ");
#line hidden
                TechTalk.SpecFlow.Table table7 = new TechTalk.SpecFlow.Table(new string[] {
                            "RecipeId",
                            "FoodId",
                            "Amount",
                            "UnitId"});
                table7.AddRow(new string[] {
                            "1",
                            "1",
                            "2",
                            "1"});
                table7.AddRow(new string[] {
                            "1",
                            "2",
                            "3",
                            "1"});
#line 31
 testRunner.And("the following recipe foods", ((string)(null)), table7, "And ");
#line hidden
#line 35
 testRunner.When("I calculate nutrient summaries", ((string)(null)), ((TechTalk.SpecFlow.Table)(null)), "When ");
#line hidden
                TechTalk.SpecFlow.Table table8 = new TechTalk.SpecFlow.Table(new string[] {
                            "NutrientId",
                            "Name",
                            "Amount"});
                table8.AddRow(new string[] {
                            "101",
                            "Vitamin C",
                            "20"});
                table8.AddRow(new string[] {
                            "102",
                            "Potassium",
                            "15"});
#line 36
 testRunner.Then("the nutrient summaries should be", ((string)(null)), table8, "Then ");
#line hidden
            }
            this.ScenarioCleanup();
        }
    }
}
#pragma warning restore
#endregion
