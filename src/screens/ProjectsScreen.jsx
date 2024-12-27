import { View } from "react-native"
import Projects from "../components/Projects"

const ProjectsScreen = () => {
    return (
        <View style={styles.container}>
            <Projects />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default ProjectsScreen;