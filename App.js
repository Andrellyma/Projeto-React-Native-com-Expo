import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Alert} from 'react-native';
import * as Location from 'expo-location'
import {useState} from 'react'
import getCurrentWeather from './api/ConsultApi'
import { EvilIcons } from '@expo/vector-icons' 
import   AsyncStorage   from   '@react-native-async-storage/async-storage';
import {database} from './src/config/firebase' 

export default function App() {

  const [chuvadao, setchuvadao] = useState([])
  const [locationCoords, setLocationCoords] = useState(null);
  const [data,setData] = useState('11/11/1111');
  const [hora,setHora] = useState('00:00');
  const [latitude, setLatitude] = useState('99');
  const [longitude, setLongitude] = useState('99');
  const [currentTemperature, setCurrentTemperature] = useState('00')
  const [locationName, setLocationName] = useState('fff, fff')
  const [temperatureMin, setTemperatureMin] = useState('00')
  const [temperatureMax, setTemperatureMax] = useState('00')
  const [wind, setWind] = useState('00')
  const [humidity, setHumidity] = useState('00')
  
  const [chuva, setChuva] = useState('nuffff');

  const Separator = () => <View style={styles.separator} />;

  async function pegarLocalizacao(){
    let { status } = await Location.requestPermissionsAsync()
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied')
    }else{
      let location = await Location.getCurrentPositionAsync({})
      await setLocationCoords(location.coords)
      console.log(location.coords)
    }
  }

  async function date(){
    let date = new Date()
    setData(date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear());
  }

  async function horacorrente(){
    let date = new Date()
    setHora(date.getHours() + ":" + date.getMinutes());
  }

  async function pegarDados(){
    await pegarLocalizacao()

    const data = await getCurrentWeather(locationCoords)
    setLatitude(locationCoords.latitude)
    setLongitude(locationCoords.longitude)
    setChuva(data[0])
    setCurrentTemperature(convertKelvinEmCelsius(data[1]))
    setTemperatureMin(convertKelvinEmCelsius(data[2]))
    setTemperatureMax(convertKelvinEmCelsius(data[3]))
    setLocationName(data[4])
    setWind(data[5])
    setHumidity(data[6])
    
  }

  async function salvar(){
    try {
      await AsyncStorage.setItem('@storage_Key', value)
    } catch (e) {
      // saving error
    }
  }

  function convertKelvinEmCelsius(temp){
    return parseInt(temp - 273)
  }

  useEffect(() => {
    date()
    horacorrente()
    pegarLocalizacao()
    pegarDados()

    //firebase
    database.collection('chuva').onSnapshot((query) => {
      const list = []
      query.forEach((doc) => {
        list.push({...doc.data(), id: doc.id});
      })
      setchuvadao(list);
    })
    
  }, [])

  function addChuva(){
    database.collection('chuva').add({
      data,
      chuva
    });
  }

  function deletar(id){
    //database.collection('chuva').doc(id).delete();
    Alert.alert(
			'Confirmação', 'Deseja realmente excluir esse item?',
			[
			  {text: 'Sim', onPress: () => {
				  	//deleta o item
            database.collection('chuva').doc(id).delete();
				}
			  },
			  {text: 'Cancel',style: 'cancel',}
			],
			{cancelable: false},
		  );
  }
  
  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.refreshButton} onPress={() => pegarDados()}>
        <EvilIcons name="refresh" color={'black'} size={45}/>
      </TouchableOpacity>

      <Separator />
      
      <Text style={styles.item}>Temperatura Atual: {currentTemperature}</Text>
      <Text style={styles.item}>{locationName}</Text>
      <Text style={styles.item}>{data} {hora}</Text>

      <Separator />

      <Text style={styles.item2}>Latitude: {latitude}</Text>
      <Text style={styles.item2}>Longitude: {longitude}</Text>
      <Text style={styles.item2}>Temperatura Mínima: {temperatureMin}</Text>
      <Text style={styles.item2}>Temperatura Maxima: {temperatureMax}</Text>
      <Text style={styles.item2}>Tempo: {chuva}</Text>
      <Text style={styles.item2}>Vento: {wind}</Text>
      <Text style={styles.item2}>Humidade: {humidity}</Text>
      
      <Separator />

      <Button title="Salvar Dia" onPress={addChuva}/>
      
      <Separator />

      <Text style={styles.item} >Lista de Dias Salvos: </Text>

      {chuvadao.map ((chuva)=> {
        return <Text style={styles.item2} key= {chuva.data} onPress={() =>deletar(chuva.id)}>{chuva.data} - {chuva.chuva}</Text>
      })}

      <StatusBar style="auto" />    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    alignItems: "center",
    height: 35,
    fontSize: 20,
    fontWeight: "bold"
  },
  item2: {
    alignItems: "center",
    height: 30,
    fontSize: 16
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
