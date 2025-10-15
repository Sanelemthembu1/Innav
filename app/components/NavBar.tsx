import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface NavBarProps {
  showDestination: boolean;
  setShowDestination: (value: boolean) => void;
  from: string;
  to: string;
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({
  showDestination,
  setShowDestination,
  from,
  to,
  setFrom,
  setTo,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <View>
            {/* Drawer overlay */}
            {drawerOpen && (
              <View style={styles.drawerOverlay}>
                <View style={styles.drawer}>
                  <Text style={styles.drawerTitle}>Menu</Text>
                  <Link href="/" asChild>
                    <Text style={styles.drawerTab} onPress={() => setDrawerOpen(false)}>Home</Text>
                  </Link>
                  <Link href="/scanScreen" asChild>
                    <Text style={styles.drawerTab} onPress={() => setDrawerOpen(false)}>Scan</Text>
                  </Link>
                  <Link href="/accessibility" asChild>
                    <Text style={styles.drawerTab} onPress={() => setDrawerOpen(false)}>Accessibility</Text>
                  </Link>
                  <Text style={styles.drawerTab} onPress={() => setDrawerOpen(false)}>Close</Text>
                </View>
              </View>
            )}
            {/* Profile drawer overlay */}
            {profileOpen && (
              <View style={styles.profileOverlay}>
                <View style={styles.profileDrawer}>
                  <Text style={styles.drawerTitle}>Profile</Text>
                  <Text style={styles.drawerTab}>View Profile</Text>
                  <Text style={styles.drawerTab}>Settings</Text>
                  <Text style={styles.drawerTab}>Logout</Text>
                  <Text style={styles.drawerTab} onPress={() => setProfileOpen(false)}>Close</Text>
                </View>
              </View>
            )}
      <View style={styles.navigationBar}>
        <View style={styles.navigationBarItems}>
          <Ionicons
            name="menu-outline"
            size={50}
            color="black"
            onPress={() => setDrawerOpen(true)}
          />
          <Text style={styles.logo}>Innav</Text>
          <Ionicons
            name="person-circle-outline"
            size={50}
            color="black"
            onPress={() => setProfileOpen(true)}
          />
        </View>

        {/* FROM input */}
        <View style={styles.navigationBarSearch}>
          <TextInput
            style={styles.searchInput}
            placeholder="From: room, office, LAN etc..."
            value={from}
            onFocus={() => setShowDestination(true)}
            onChangeText={setFrom}
          />
        </View>

        {/* TO input */}
        {showDestination && (
          <View style={styles.navigationBarSearch}>
            <TextInput
              style={[styles.searchInput, { marginTop: 5 }]}
              placeholder="To: destination room, office, LAN etc..."
              value={to}
              onChangeText={setTo}
              autoFocus
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  navigationBar:{
    paddingRight:10,
    paddingLeft:10,
    paddingTop:20,
    borderColor:"grey",
    borderBottomWidth:2,
    backgroundColor:"white", // ensures visible above floor plan
    borderBottomColor:"grey",
    width:"100%",
  },


      navigationBarItems:{
        alignItems:"center",
        justifyContent:"space-between",
        flexDirection:"row",
        height:50,
      },
      profile:{
        alignItems:"center",
        justifyContent:"center"

      },
      logo:{
        fontWeight:"bold",
        fontSize:25,
        color:"black"
      },
      navigationBarSearch:{
        alignItems:"center",
        flexDirection:"row",
        height:50,

      },
      
      searchInput:{
        height:40,
        width:"100%",
        flex: 1,
        paddingRight:20,
        paddingLeft:50,
        borderStyle:"solid",
        borderColor:"black",
        borderWidth:1,
        borderRadius:20,
        backgroundColor:"white",
        
        
      },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 100,
    flexDirection: 'row',
  },
  drawer: {
    width: 220,
    backgroundColor: 'white',
    height: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 101,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  profileDrawer: {
    width: 180,
    backgroundColor: 'white',
    height: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  drawerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 20,
  },
  drawerTab: {
    fontSize: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
