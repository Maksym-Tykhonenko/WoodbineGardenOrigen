import { View } from "react-native"
import PostDetails from "../components/PostDetails"

const PostDetailsScreen = ({ route }) => {
    const { post } = route.params;

    return (
        <View style={styles.container}>
            <PostDetails post={post} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default PostDetailsScreen;