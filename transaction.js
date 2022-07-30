import React,{Component} from "react";
import { View, Text, StyleSheet, TouchableOpacity,
TextInput, Image, ImageBackground } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from '../config';


const bgImage = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName =  require("../assets/appName.png");

export default class TransactionScreen extends Component {
    constructor(props){
        super(props);
        this.state ={
          studentId: " ",
          bookId: " ",  
          domState: 'normal',
            hasCameraPermissions: null,
            scanned: false,
            scannedData: " ",
        }
    }
    getCameraPermisions = async domState=> {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);

        this.setState({
            hasCameraPermissions: status==="granted",
            domState: domState,
            scanned: false
        })
    }
        hadlerBarCodeScanned = async ({type, data}) =>{
          const {domState} = this.state; 

          if (domState === "bookId") {
            this.setState({
               bookId: data,
              domState: "normal",
              scanned: true
              });
            }else if(domState === "studentId"){
              this.setState({
                studentId: data,
                domState: "normal",
                scanned: true
                })
            }
          }
          
          
          hadlerTransaction = () => {
            var {bookId} = this.state;

            db.collection("book").doc.apply(bookId).get().then( doc => {
              console.log(doc.data());
            })
          };
        render()  {
            const{ domState, hasCameraPermissions, scanned, scannedData, bookId, studentId} = this.state;
            if (domState !== "normal"){
                return(
                    <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : this.hadlerBarCodeScanned}
                    style= {StyleSheet.absoluteFillObject}/>    
                )
            }
            return (
                <View style={styles.container}>
                <ImageBackground source={bgImage} style={styles.bgImage}>
                <View style={styles.upperContainer} >
                  <Image source={appIcon} style={styles.appIcon} />
                  <Image source={appName} style={[styles.appName, { marginTop: 25 }]} />
                </View>
          
                <View style={styles.lowerContainer}>
                  <View style={styles.textinputContainer} >
                    <TextInput style={styles.textinput} 
                    placeholder={"ID do Livro"}
                    placeholderTextColor={"white"}
                   value={bookId}
                    />
          
                    <TouchableOpacity 
                    style={styles.scanbutton}
                    onPress={()=> this.getCameraPermissions("bookId")}
                    >
                      <Text style={styles.scanbuttonText}  > Digitalizar</Text>
                    </TouchableOpacity>
          
                  </View>
          
                  <View style={[styles.textinputContainer, { marginTop: 25 }]}>
                    <TextInput
                    style={styles.textinput} 
                    placeholder={"ID do Aluno"}
                    placeholderTextColor={"white"}
                    value={studentId}
                    />
          
                    <TouchableOpacity 
                    style={styles.scanbutton} 
                    onPress={()=> this.getCameraPermissions("studentId")}
                    >
                      <Text style={styles.scanbuttonText} >Digitalizar</Text>
                    </TouchableOpacity>
          
                  </View>
                <TouchableOpacity style={styles.button}
                onPress = {this.hadlerTransaction}>
                  <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>

                </View>
                </ImageBackground> 
                </View>
          
          
        )
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black"
    },
    upperContainer: {
      flex: 0.5,
      justifyContent: "center",
      alignItems: "center"
    },
    lowerContainer: {
      flex: 0.5,
      alignItems: "center"
    },
    text: {
      color: "#ffff",
      fontSize: 30
    },
    textinput: {
      width: "57%",
      height: 50,
      padding: 10,
      borderColor: "white",
      borderRadius: 10,
      borderWidth: 3,
      fontSize: 18,
      backgroundColor: "#5653D4",
      fontFamily: "Rajdhani_600SemiBold",
      color: "#FFFFFF"
    },
    scanbutton: {
      width: 100,
      height: 50,
      backgroundColor: "#9DFD24",
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      justifyContent: "center",
      alignItems: "center"
    },
    scanbuttonText: {
      fontSize: 20,
      color: "#0A0101",
      fontFamily: "Rajdhani_600SemiBold"
    },
    textinputContainer: {
      borderWidth: 2,
      borderRadius: 10,
      flexDirection: "row",
      backgroundColor: "#9DFD24",
      borderColor: "#FFFFFF"
    },
    appIcon: {
      width: 200,
      height: 200,
      resizeMode: "contain",
      marginTop: 80,
  
    },
    appName: {
      width: 500,
      resizeMode: "contain",
      borderWidth: 3,
      borderColor: "white"
  
    },
    bgImage: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center"
    },
    button: {
      width: "43%",
      height: 55,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F48D20",
      borderRadius: 15
    },
    buttonText: {
      fontSize: 24,
      color: "#FFFFFF",
      fontFamily: "Rajdhani_600SemiBold"
    }
  });


