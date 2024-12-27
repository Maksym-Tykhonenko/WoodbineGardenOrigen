import { View } from "react-native"
import EventDetails from "../components/EventDetails"

const EventDetailsScreen = ({ route }) => {
    const { event } = route.params;

    return (
        <View style={styles.container}>
            <EventDetails event={event} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default EventDetailsScreen;