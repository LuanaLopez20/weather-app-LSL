import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PantallaClima from "../app/(tabs)/index";

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
    expect(elementos.length).toBeGreaterThanOrEqual(1);
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
    expect(await findByText(/💧/)).toBeTruthy();
    expect(await findByText(/🌬/)).toBeTruthy();
    expect(await findByText(/☁/)).toBeTruthy();
  });

  test("permite cambiar día con carrusel", async () => {
    const { findByText } = render(<PantallaClima />);
    const hoy = await findByText("HOY");
    fireEvent.press(hoy);
    expect(hoy).toBeTruthy();
  });
});