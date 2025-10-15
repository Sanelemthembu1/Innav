import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, usePathname } from "expo-router";
import React from 'react';
import { StyleSheet, View } from 'react-native';

const BottomBar: React.FC = () => {
  const pathname = usePathname();
  return (
    <View style={styles.tabScreen}>
      <View>
          <Link href="/" asChild>
            <Ionicons
              name={pathname === '/' || pathname === '/index' ? 'navigate' : 'navigate-outline'}
              size={35}
              color={pathname === '/' || pathname === '/index' ? 'black' : 'grey'}
            />
          </Link>
      </View>
      <View>
        <Link href="./scanScreen" asChild>
          <Ionicons
            name={pathname === '/scanScreen' ? 'scan' : 'scan-outline'}
            size={50}
            color={pathname === '/scanScreen' ? 'black' : 'grey'}
          />
        </Link>
      </View>
      <View>
        <Link href="./accessibility" asChild>
          <Ionicons
            name={pathname === '/accessibility' ? 'accessibility' : 'accessibility-outline'}
            size={35}
            color={pathname === '/accessibility' ? 'black' : 'grey'}
          />
        </Link>
      </View>
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
    tabScreen:{
        alignItems:"center",
        justifyContent:"space-evenly",       
        flexDirection:"row",
        height:50,
        width:"100%",
        borderStyle:"solid",
        borderColor:"grey",
        borderTopWidth:2,
        backgroundColor:"white", // not transparent
      }
    }
)