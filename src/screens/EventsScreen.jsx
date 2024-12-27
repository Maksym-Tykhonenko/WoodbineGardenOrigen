import { View } from "react-native"
import Events from "../components/Events"
import MenuPanel from "../components/MenuPanel";

const EventsScreen = () => {
    return (
        <View style={styles.container}>
            <Events />
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

export default EventsScreen;