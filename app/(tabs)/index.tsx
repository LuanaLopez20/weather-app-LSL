import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Svg, { Circle, Line, Path } from "react-native-svg";
import * as Location from "expo-location";

const API_KEY = "6f062217425c4e79878200647262304";

const dias = ["DOMINGO","LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SÁBADO"];
const meses = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];

function fecha(i:number){
  const d = new Date(Date.now()+(i-1)*86400000);
  return `${dias[d.getDay()]} ${d.getDate()} DE ${meses[d.getMonth()]}`;
}

function etiqueta(i:number){
  if(i===0)return"AYER";
  if(i===1)return"HOY";
  return"MAÑANA";
}

function Icono({condicion}:{condicion:string}){
  const c=condicion.toLowerCase();
  const size=240;

  if(c.includes("rain")){
    return(
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Line x1="30" y1="20" x2="10" y2="80" stroke="black" strokeWidth="6"/>
        <Line x1="50" y1="20" x2="30" y2="80" stroke="black" strokeWidth="6"/>
        <Line x1="70" y1="20" x2="50" y2="80" stroke="black" strokeWidth="6"/>
      </Svg>
    );
  }

  if(c.includes("cloud")){
    return(
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M20 60 Q30 40 50 50 Q60 30 80 50 Q90 60 70 70 H30 Q10 70 20 60 Z"
          stroke="black" strokeWidth="6" fill="none"/>
      </Svg>
    );
  }

  return(
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="30" stroke="black" strokeWidth="6" fill="none"/>
    </Svg>
  );
}

export default function Index(){
  const [i,setI]=useState(1);
  const [datos,setDatos]=useState<any[]>([]);
  const [presion,setPresion]=useState<number|null>(null);
  const [city,setCity]=useState("...");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Sin permiso de ubicación");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;

      fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`
      )
        .then(r=>r.json())
        .then(d=>{
          setDatos(d.forecast.forecastday);
          setPresion(d.current.pressure_mb);
          setCity(d.location.name);
          setLoading(false);
        });
    })();
  },[]);

  if(loading || !datos.length){
    return(
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const a=datos[i];

  return(
    <View style={styles.container}>
      <Text style={styles.city}>{city.toUpperCase()}</Text>
      <Text style={styles.tag}>{etiqueta(i)}</Text>

      <View style={styles.row}>
        <TouchableOpacity onPress={()=>setI(Math.max(0,i-1))}>
          <Text style={styles.side}>{i>0?fecha(i-1):""}</Text>
        </TouchableOpacity>

        <Text style={styles.center}>{fecha(i)}</Text>

        <TouchableOpacity onPress={()=>setI(Math.min(datos.length-1,i+1))}>
          <Text style={styles.side}>{i<datos.length-1?fecha(i+1):""}</Text>
        </TouchableOpacity>
      </View>

      <Icono condicion={a.day.condition.text}/>

      <View style={styles.tempBlock}>
        <View style={styles.sideTemp}>
          <Text style={styles.sideNumber}>{Math.round(a.day.mintemp_c)}°</Text>
          <Text style={styles.sideLabel}>MIN</Text>
        </View>

        <Text style={styles.big}>{Math.round(a.day.avgtemp_c)}°</Text>

        <View style={styles.sideTemp}>
          <Text style={styles.sideNumber}>{Math.round(a.day.maxtemp_c)}°</Text>
          <Text style={styles.sideLabel}>MAX</Text>
        </View>
      </View>

      <View style={styles.nowRow}>
        <View style={styles.line}/>
        <Text style={styles.now}>NOW</Text>
        <View style={styles.line}/>
      </View>

      <View style={styles.metrics}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="water-outline" size={16}/>
          <Text>{a.day.avghumidity}%</Text>
        </View>

        <View style={styles.card}>
          <MaterialCommunityIcons name="gauge" size={16}/>
          <Text>{presion} hPa</Text>
        </View>

        <View style={styles.card}>
          <MaterialCommunityIcons name="weather-windy" size={16}/>
          <Text>{a.day.maxwind_kph} km/h</Text>
        </View>
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"#fff",padding:20},

  city:{fontSize:32,fontWeight:"700"},
  tag:{fontSize:12,opacity:0.5},

  row:{flexDirection:"row",marginBottom:10,gap:15},
  center:{fontSize:14},
  side:{fontSize:10,opacity:0.3},

  tempBlock:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    gap:25,
    marginTop:10
  },

  sideTemp:{alignItems:"center"},
  sideNumber:{fontSize:18,opacity:0.7},
  sideLabel:{fontSize:10,opacity:0.5},

  big:{fontSize:70},

  nowRow:{
    flexDirection:"row",
    alignItems:"center",
    gap:10,
    marginTop:5
  },

  now:{fontSize:12,opacity:0.5},

  line:{width:50,height:1,backgroundColor:"#bbb"},

  metrics:{flexDirection:"row",gap:10,marginTop:20},

  card:{
    flexDirection:"row",
    alignItems:"center",
    gap:5,
    backgroundColor:"#eee",
    padding:8,
    borderRadius:20
  }
});