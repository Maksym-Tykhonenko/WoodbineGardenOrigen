import { View } from "react-native"
import Profile from "../components/Profile"
import MenuPanel from "../components/MenuPanel";

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Profile />
            <View style={styles.menu}>
                <MenuPanel />
            </View>
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },
    menu: {
        position: 'absolute',
        width: "100%",
        bottom: 0
    }
}

export default ProfileScreen;