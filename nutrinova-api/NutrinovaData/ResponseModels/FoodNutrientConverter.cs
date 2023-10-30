using System.Text.Json;
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

            if (root.TryGetProperty("nutrient", out _) && nutrientObject.TryGetProperty("name", out var unitName))
            {
                foodNutrient.unitName = unitName.GetString();
            }
            else if (root.TryGetProperty("nutrient:unitName", out var unitNameProperty))
            {
                foodNutrient.unitName = unitNameProperty.GetString();
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
                foodNutrient.value = amountProperty.GetDouble();
            }
            else if (root.TryGetProperty("value", out var valueProperty))
            {
                foodNutrient.value = valueProperty.GetDouble();
            }

            return foodNutrient;
        }
    }

    // This is used for serialization and will need to be implemented if we ever need to serialize FoodNutrient objects
    public override void Write(Utf8JsonWriter writer, FoodNutrient value, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }
}
