import { View } from "react-native"
import DesireDetails from "../components/DesireDetails"

const DesireDetailsScreen = ({ route }) => {
    const { desire } = route.params;

    return (
        <View style={styles.container}>
            <DesireDetails desire={desire} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default DesireDetailsScreen;