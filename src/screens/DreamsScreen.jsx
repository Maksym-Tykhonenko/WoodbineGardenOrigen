import { View } from "react-native"
import Dreams from "../components/Dreams"

const DreamsScreen = () => {
    return (
        <View style={styles.container}>
            <Dreams />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default DreamsScreen;