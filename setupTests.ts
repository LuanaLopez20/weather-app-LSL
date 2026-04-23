global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        forecast: {
          forecastday: [
            {
              day: {
                avgtemp_c: 25,
                mintemp_c: 20,
                maxtemp_c: 30,
                avghumidity: 60,
                maxwind_kph: 15,
                daily_chance_of_rain: 20,
                condition: { text: "Sunny" },
              },
            },
            {
              day: {
                avgtemp_c: 22,
                mintemp_c: 18,
                maxtemp_c: 27,
                avghumidity: 55,
                maxwind_kph: 10,
                daily_chance_of_rain: 10,
                condition: { text: "Cloudy" },
              },
            },
            {
              day: {
                avgtemp_c: 20,
                mintemp_c: 16,
                maxtemp_c: 24,
                avghumidity: 70,
                maxwind_kph: 20,
                daily_chance_of_rain: 60,
                condition: { text: "Rain" },
              },
            },
          ],
        },
      }),
  })
) as jest.Mock;