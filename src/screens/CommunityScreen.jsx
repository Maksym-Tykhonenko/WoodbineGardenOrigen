import { View } from "react-native"
import Community from "../components/Community"
import MenuPanel from "../components/MenuPanel";

const CommunityScreen = () => {
    return (
        <View style={styles.container}>
            <Community />
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

export default CommunityScreen;