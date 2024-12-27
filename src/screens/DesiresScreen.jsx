import { View } from "react-native"
import Desires from "../components/Desires"

const DesiresScreen = () => {
    return (
        <View style={styles.container}>
            <Desires />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default DesiresScreen;