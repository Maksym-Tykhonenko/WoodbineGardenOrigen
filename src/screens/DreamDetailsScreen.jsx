import { View } from "react-native"
import DreamDetails from "../components/DreamDetails"

const DreamDetailsScreen = ({ route }) => {
    const { dream } = route.params;

    return (
        <View style={styles.container}>
            <DreamDetails dream={dream} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default DreamDetailsScreen;