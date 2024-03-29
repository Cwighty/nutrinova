﻿using System.Text.Json;
using System.Text.Json.Serialization;
using NutrinovaData.ResponseModels;

public class FoodNutrientConverter : JsonConverter<FoodNutrient>
{
  public override FoodNutrient Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
  {
    using (JsonDocument doc = JsonDocument.ParseValue(ref reader))
    {
      var root = doc.RootElement;
      var foodNutrient = new FoodNutrient();

      if (root.TryGetProperty("nutrientId", out var nutrientIdProperty))
      {
        foodNutrient.nutrientId = nutrientIdProperty.GetInt32();
      }

      if (root.TryGetProperty("nutrient", out var nutrientObject) && nutrientObject.TryGetProperty("name", out var nameProperty))
      {
        foodNutrient.nutrientName = nameProperty.GetString();
      }
      else if (root.TryGetProperty("nutrientName", out var nutrientNameProperty))
      {
        foodNutrient.nutrientName = nutrientNameProperty.GetString();
      }

      if (root.TryGetProperty("nutrientNumber", out var nutrientNumberProperty))
      {
        foodNutrient.nutrientNumber = nutrientNumberProperty.GetString();
      }

      if (root.TryGetProperty("nutrient", out _) && nutrientObject.TryGetProperty("unitName", out var unitName1))
      {
        foodNutrient.unitName = unitName1.GetString();
      }
      else if (root.TryGetProperty("nutrient:unitName", out var unitName2))
      {
        foodNutrient.unitName = unitName2.GetString();
      }
      else if (root.TryGetProperty("unitName", out var unitName3))
      {
        foodNutrient.unitName = unitName3.GetString();
      }

      if (root.TryGetProperty("derivationCode", out var derivationCodeProperty))
      {
        foodNutrient.derivationCode = derivationCodeProperty.GetString();
      }

      if (root.TryGetProperty("foodNutrientDerivation", out var foodNutrientDerivationObject) && foodNutrientDerivationObject.TryGetProperty("description", out var description))
      {
        foodNutrient.derivationDescription = description.GetString();
      }
      else if (root.TryGetProperty("derivationDescription", out var derivationDescriptionProperty))
      {
        foodNutrient.derivationDescription = derivationDescriptionProperty.GetString();
      }

      if (root.TryGetProperty("amount", out var amountProperty))
      {
        foodNutrient.value = amountProperty.GetDecimal();
      }
      else if (root.TryGetProperty("value", out var valueProperty))
      {
        foodNutrient.value = valueProperty.GetDecimal();
      }
      else if (root.TryGetProperty("Value", out var valueProp))
      {
        foodNutrient.value = valueProp.GetDecimal();
      }

      if (root.TryGetProperty("unit", out var unitObject) && unitObject.TryGetProperty("id", out var unitId))
      {
        foodNutrient.unitId = unitId.GetInt32();
      }
      else if (root.TryGetProperty("unitId", out var unitIdProperty))
      {
        foodNutrient.unitId = unitIdProperty.GetInt32();
      }

      if (root.TryGetProperty("unit", out var unit) && unit.TryGetProperty("unitCategory", out var unitCategory) && unitCategory.TryGetProperty("id", out var unitCategoryId))
      {
        foodNutrient.UnitCategoryId = unitCategoryId.GetDouble();
      }
      else if (root.TryGetProperty("unitCategoryId", out var unitCategoryIdProperty))
      {
        foodNutrient.UnitCategoryId = unitCategoryIdProperty.GetDouble();
      }

      return foodNutrient;
    }
  }

  // This is used for serialization and will need to be implemented if we ever need to serialize FoodNutrient objects
  public override void Write(Utf8JsonWriter writer, FoodNutrient value, JsonSerializerOptions options)
  {
    writer.WriteStartObject();

    writer.WriteNumber("nutrientId", value.nutrientId);

    if (!string.IsNullOrEmpty(value.nutrientName))
    {
      writer.WriteString("nutrientName", value.nutrientName);
    }

    if (!string.IsNullOrEmpty(value.nutrientNumber))
    {
      writer.WriteString("nutrientNumber", value.nutrientNumber);
    }

    if (!string.IsNullOrEmpty(value.unitName))
    {
      writer.WriteString("unitName", value.unitName);
    }

    if (!string.IsNullOrEmpty(value.derivationCode))
    {
      writer.WriteString("derivationCode", value.derivationCode);
    }

    if (!string.IsNullOrEmpty(value.derivationDescription))
    {
      writer.WriteString("derivationDescription", value.derivationDescription);
    }

    if (value.unitId > 0)
    {
      writer.WriteNumber("unitId", value.unitId);
    }

    if (value.UnitCategoryId > 0)
    {
      writer.WriteNumber("UnitCategoryId", (decimal)value.UnitCategoryId);
    }

    writer.WriteNumber("value", value.value);

    writer.WriteEndObject();
  }
}
