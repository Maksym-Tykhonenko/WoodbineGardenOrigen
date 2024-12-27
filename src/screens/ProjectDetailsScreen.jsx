import { View } from "react-native"
import ProjectDetails from "../components/ProjectDetails"

const ProjectDetailsScreen = ({ route }) => {
    const { project } = route.params;

    return (
        <View style={styles.container}>
            <ProjectDetails project={project} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default ProjectDetailsScreen;