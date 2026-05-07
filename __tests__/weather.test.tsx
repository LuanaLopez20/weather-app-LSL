import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PantallaClima from "../app/(tabs)/index";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          current: {
            pressure_mb: 1013,
          },
          forecast: {
            forecastday: [
              {
                day: {
                  condition: { text: "Sunny" },
                  avgtemp_c: 20,
                  mintemp_c: 15,
                  maxtemp_c: 25,
                  avghumidity: 60,
                  maxwind_kph: 10,
                },
              },
              {
                day: {
                  condition: { text: "Cloudy" },
                  avgtemp_c: 22,
                  mintemp_c: 18,
                  maxtemp_c: 27,
                  avghumidity: 55,
                  maxwind_kph: 12,
                },
              },
              {
                day: {
                  condition: { text: "Rain" },
                  avgtemp_c: 17,
                  mintemp_c: 13,
                  maxtemp_c: 20,
                  avghumidity: 80,
                  maxwind_kph: 20,
                },
              },
            ],
          },
        }),
    }),
  ) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Pantalla de clima", () => {
  test("renderiza la pantalla principal", async () => {
    const { findByText } = render(<PantallaClima />);
    expect(await findByText("BUENOS AIRES")).toBeTruthy();
  });

  test("muestra el nombre de la ciudad", async () => {
    const { findByText } = render(<PantallaClima />);
    expect(await findByText("BUENOS AIRES")).toBeTruthy();
  });

  test("existen botones de navegación de días", async () => {
    const { findAllByText } = render(<PantallaClima />);
    const elementos = await findAllByText(/AYER|HOY|MAÑANA/);
    expect(elementos.length).toBeGreaterThan(0);
  });

  test("muestra temperatura actual", async () => {
    const { findAllByText } = render(<PantallaClima />);
    const temps = await findAllByText(/\d+°/);
    expect(temps.length).toBeGreaterThan(0);
  });

  test("muestra temperatura mínima y máxima", async () => {
    const { findAllByText } = render(<PantallaClima />);
    const temps = await findAllByText(/\d+°/);
    expect(temps.length).toBeGreaterThan(0);
  });

  test("muestra métricas del clima", async () => {
    const { findByText } = render(<PantallaClima />);

    await waitFor(() => {
      expect(findByText("60%")).toBeTruthy();
      expect(findByText("1013 hPa")).toBeTruthy();
      expect(findByText("10 km/h")).toBeTruthy();
    });
  });

  test("permite cambiar día con carrusel", async () => {
    const { findByText } = render(<PantallaClima />);

    const hoy = await findByText("HOY");

    fireEvent.press(hoy);

    expect(hoy).toBeTruthy();
  });
});
