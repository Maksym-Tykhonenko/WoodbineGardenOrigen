import { View } from "react-native"
import Plants from "../components/Plants"

const PlantsScreen = () => {
    return (
        <View style={styles.container}>
            <Plants />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default PlantsScreen;