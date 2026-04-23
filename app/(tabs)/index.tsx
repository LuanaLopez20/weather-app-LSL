import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Fontisto from "@expo/vector-icons/Fontisto";

const API_KEY = "6f062217425c4e79878200647262304";

const dias = ["DOMINGO","LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SÁBADO"];
const meses = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];

function obtenerFecha(indice: number) {
  const hoy = new Date();
  if (indice === 0) return new Date(hoy.getTime() - 86400000);
  if (indice === 1) return hoy;
  return new Date(hoy.getTime() + 86400000);
}

function obtenerEtiqueta(indice: number) {
  if (indice === 0) return "AYER";
  if (indice === 1) return "HOY";
  return "MAÑANA";
}

function formatearFechaCompleta(indice: number) {
  const fecha = obtenerFecha(indice);
  return `${dias[fecha.getDay()]} ${fecha.getDate()} DE ${meses[fecha.getMonth()]}`;
}

function formatearFechaCorta(indice: number) {
  const fecha = obtenerFecha(indice);
  return `${dias[fecha.getDay()]} ${fecha.getDate()}`;
}

function IconoClima({ condicion, hora }: { condicion: string; hora: number }) {
  const texto = condicion.toLowerCase();

  const esAmanecer = hora >= 5 && hora < 7;
  const esNoche = hora >= 19 || hora < 5;

  if (esAmanecer) {
    return (
      <MaterialCommunityIcons
        name="weather-sunset-up"
        size={120}
        color="orange"
      />
    );
  }

  if (esNoche) {
    if (texto.includes("rain")) {
      return (
        <Fontisto
          name="night-alt-rain"
          size={120}
          color="#3b82f6" // azul lluvia
        />
      );
    }

    if (texto.includes("cloud")) {
      return (
        <MaterialCommunityIcons
          name="weather-night-partly-cloudy"
          size={120}
          color="gray"
        />
      );
    }

    return (
      <MaterialCommunityIcons
        name="weather-night"
        size={120}
        color="black"
      />
    );
  }

  if (texto.includes("storm") || texto.includes("thunder")) {
    return (
      <View style={{ flexDirection: "row" }}>
        <MaterialCommunityIcons name="weather-lightning" size={60} color="gray" />
        <MaterialCommunityIcons name="weather-cloudy" size={60} color="gray" />
      </View>
    );
  }

  if (texto.includes("rain")) {
    return (
      <MaterialCommunityIcons
        name="weather-pouring"
        size={120}
        color="#3b82f6" // azul
      />
    );
  }

  if (texto.includes("wind")) {
    return (
      <MaterialCommunityIcons
        name="weather-windy"
        size={120}
        color="gray"
      />
    );
  }

  if (texto.includes("cloud")) {
    return (
      <MaterialCommunityIcons
        name="weather-cloudy"
        size={120}
        color="gray"
      />
    );
  }

  if (texto.includes("sunny") || texto.includes("clear")) {
    return (
      <Fontisto
        name="day-sunny"
        size={120}
        color="#facc15" // amarillo sol
      />
    );
  }

  return (
    <MaterialCommunityIcons
      name="weather-partly-cloudy"
      size={120}
      color="gray"
    />
  );
}

export default function PantallaClima() {
  const [datos, setDatos] = useState<any[]>([]);
  const [indice, setIndice] = useState(1);

  const [tap, setTap] = useState(0);
  const [admin, setAdmin] = useState(false);

  const [horaTest, setHoraTest] = useState<number | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState<number | null>(null);

  const hora = horaTest ?? new Date().getHours();

  useEffect(() => {
    const hoy = new Date();
    const ayer = new Date(hoy.getTime() - 86400000);
    const fechaAyer = ayer.toISOString().split("T")[0];

    Promise.all([
      fetch(`https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=Buenos Aires&dt=${fechaAyer}`).then(r => r.json()),
      fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=Buenos Aires&days=2&aqi=no&alerts=no`).then(r => r.json())
    ]).then(([hist, forecast]) => {
      setDatos([
        hist.forecast.forecastday[0],
        forecast.forecast.forecastday[0],
        forecast.forecast.forecastday[1],
      ]);
    });
  }, []);

  const actual = datos[indice];

  const activarAdmin = () => {
    const nuevo = tap + 1;
    setTap(nuevo);
    if (nuevo >= 5) {
      setAdmin(true);
      setTap(0);
    }
  };

  return (
    <View style={styles.container}>
      {!actual ? (
        <Text>Cargando...</Text>
      ) : (
        <>
          <TouchableOpacity onPress={activarAdmin}>
            <Text style={styles.ciudad}>BUENOS AIRES</Text>
          </TouchableOpacity>

          {admin && (
            <View style={styles.adminBox}>
              <Text style={{ fontWeight: "bold" }}>
                Hola Admin, mira tu app funcionando
              </Text>

              <Text style={{ marginTop: 5, opacity: 0.6 }}>
                Test de horas
              </Text>

              <View style={styles.horasBox}>
                {[1, 5, 9, 13, 17, 21].map((h) => (
                  <TouchableOpacity
                    key={h}
                    onPress={() => {
                      setHoraTest(h);
                      setHoraSeleccionada(h);
                    }}
                  >
                    <Text
                      style={[
                        styles.botonHora,
                        horaSeleccionada === h && styles.horaActiva,
                      ]}
                    >
                      {h}:00
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => {
                  setAdmin(false);
                  setHoraTest(null);
                  setHoraSeleccionada(null);
                }}
              >
                <Text style={{ marginTop: 10, color: "red" }}>SALIR</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.carrusel}>
            <TouchableOpacity onPress={() => setIndice(Math.max(0, indice - 1))} style={styles.lado}>
              <Text style={styles.lateral}>
                {indice > 0 ? formatearFechaCorta(indice - 1) : ""}
              </Text>
            </TouchableOpacity>

            <View style={styles.centro}>
              <Text style={styles.label}>{obtenerEtiqueta(indice)}</Text>
              <Text style={styles.fecha}>{formatearFechaCompleta(indice)}</Text>
            </View>

            <TouchableOpacity onPress={() => setIndice(Math.min(datos.length - 1, indice + 1))} style={styles.lado}>
              <Text style={styles.lateral}>
                {indice < datos.length - 1 ? formatearFechaCorta(indice + 1) : ""}
              </Text>
            </TouchableOpacity>
          </View>

          <IconoClima condicion={actual.day.condition.text} hora={hora} />

          <Text style={styles.temperatura}>{`${Math.round(actual.day.avgtemp_c)}°`}</Text>

          <View style={styles.minmax}>
            <Text>{`${Math.round(actual.day.mintemp_c)}°`}</Text>
            <Text>{`${Math.round(actual.day.maxtemp_c)}°`}</Text>
          </View>

          <View style={styles.metricas}>
            <Text>💧 {actual.day.avghumidity}%</Text>
            <Text>🌬 {actual.day.maxwind_kph} km/h</Text>
            <Text>☁ {actual.day.daily_chance_of_rain}%</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5" },
  ciudad: { fontSize: 26, fontWeight: "800", letterSpacing: 2 },

  carrusel: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 20 },
  centro: { marginHorizontal: 15, alignItems: "center" },
  lado: { width: 90, alignItems: "center" },

  label: { fontSize: 12, opacity: 0.6 },
  fecha: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
  lateral: { fontSize: 10, opacity: 0.3, textAlign: "center" },

  temperatura: { fontSize: 60, fontWeight: "bold" },
  minmax: { flexDirection: "row", gap: 20 },
  metricas: { marginTop: 20, gap: 5 },

  adminBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },

  horasBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
    justifyContent: "center",
  },

  botonHora: {
    padding: 6,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },

  horaActiva: {
    backgroundColor: "red",
    color: "white",
    fontWeight: "bold",
  },
});