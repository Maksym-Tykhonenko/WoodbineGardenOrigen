import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icons from './Icons';

const { height } = Dimensions.get('screen');

const PostDetails = ({ post }) => {
    const navigation = useNavigation();

    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex:1}}>
            <View style={styles.container}>

                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                    <Icons type={'back'} />
                </TouchableOpacity>

                <Text style={styles.title}>Post</Text>

                <Image source={{uri: post.imageURI}} style={styles.image} />

                <ScrollView style={{width: '100%'}}>
                    <Text style={styles.description}>{post.desc}</Text>
                </ScrollView>

            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        paddingTop: height * 0.07,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: height * 0.03
    },

    back: {
        width: 23,
        height: 33,
        position: 'absolute',
        top: height * 0.065,
        left: 20
    },

    image: {
        width: '100%',
        height: 230,
        borderRadius: 12,
        resizeMode: 'cover',
        marginBottom: 20
    },

    description: {
        fontSize: 15,
        fontWeight: 400,
        color: '#fff',
        opacity: 0.5,
    }

});

export default PostDetails;