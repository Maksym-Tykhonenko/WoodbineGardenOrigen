import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView, Alert, ImageBackground } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native'
import Icons from './Icons';

const { height } = Dimensions.get('screen');

const Community = () => {
    const navigation = useNavigation();
    const [addPressed, setAddPressed] = useState(false);
    const [imageURI, setImageURI] = useState(null);
    const [desc, setDesc] = useState('');
    const [posts, setPosts] = useState([]);

    const [descError, setDescError] = useState('');
    const [imageError, setImageError] = useState('');

    const loadPosts = useCallback(async () => {
        try {
            const savedPosts = await AsyncStorage.getItem('posts');
            if (savedPosts) {
                setPosts(JSON.parse(savedPosts));
            }
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    }, []);

    useEffect(() => {
        loadPosts()
    }, [!addPressed])

    useFocusEffect(
        useCallback(() => {
            loadPosts();
        }, [loadPosts])
    );

    const handleImageUpload = () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 1 },
            (response) => {
                if (response.didCancel) {
                    console.log('Image picker cancelled');
                } else if (response.errorCode) {
                    console.error('Image picker error: ', response.errorMessage);
                } else {
                    const uri = response.assets[0]?.uri;
                    if (uri) setImageURI(uri);
                }
            }
        );
    };  
    
    const submitPost = async () => {
        let valid = true;

        setImageError('');
        setDescError('');

        if (!imageURI) {
            setImageError('Image cannot be empty.');
            valid = false;
        }

        if (!desc) {
            setDescError('Description cannot be empty.');
            valid = false;
        }

        if (!valid) {
            console.log("Form validation failed!");
            return;
        }        

        const newPost = {
            desc,
            imageURI,
            id: Date.now(),
        };

        try {
            const existingPosts = await AsyncStorage.getItem('posts');
            const postsArray = existingPosts ? JSON.parse(existingPosts) : [];
            postsArray.push(newPost);

            await AsyncStorage.setItem('posts', JSON.stringify(postsArray));
            Alert.alert("Success", "Post added successfully!");

            setDesc('');
            setImageURI(null);

            setAddPressed(false);

        } catch (error) {
            console.error("Error saving post:", error);
            Alert.alert("Error", "Failed to save post. Please try again.");
        }
    };

    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex:1}}>
            <View style={styles.container}>

                {
                    addPressed ? (
                        <View style={{width: '100%', height: '100%'}}>
                            <Text style={styles.title}>Add post</Text>

                            <ScrollView style={{width: '100%'}}>
                                <TouchableOpacity style={styles.imageUploadBtn} onPress={handleImageUpload}>
                                    {imageURI ? (
                                        <Image source={{ uri: imageURI }} style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 12 }} />
                                    ) : (
                                        <Image source={require('../assets/decor/image.png')} style={{width: 124, height: 124}} />
                                    )}
                                </TouchableOpacity>
                                {imageError ? <Text style={styles.error}>{imageError}</Text> : null}

                                <TextInput
                                    value={desc}
                                    placeholder='Write here...'
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    onChangeText={(d) => setDesc(d)}
                                    multiline={true}
                                    style={[styles.input, {height: 140}]}
                                />
                                {descError ? <Text style={styles.error}>{descError}</Text> : null}
                            </ScrollView>

                        </View>
                    ) : (
                        <View style={{width: '100%', height: '100%'}}>
                            <Text style={styles.title}>Community</Text>

                            <ScrollView style={{width: '100%'}}>
                                {
                                    posts?.map((post, index) => (
                                        <TouchableOpacity key={index} style={styles.post} onPress={() => navigation.navigate('PostDetailsScreen', {post: post})}>
                                            <Image source={{uri: post.imageURI}} style={styles.postImage} />
                                            <Text style={styles.postDesc} numberOfLines={3} ellipsizeMode="tail">{post.desc}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </ScrollView>

                            <View style={{height: 170}} />

                        </View>
                    )
                }

                <TouchableOpacity style={styles.addBtn} onPress={() => {
                        if (addPressed) {
                            submitPost();
                        } else {
                            setAddPressed(true);
                        }
                    }}
                    >
                    <View style={styles.addIcon}>
                        <Icons type={'add'} />
                    </View>
                    <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>

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
        top: 0,
        left: 0
    },

    addBtn: {
        position: 'absolute',
        bottom: height * 0.16,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#ff0004',
        padding: 16
    },

    addIcon: {
        width: 24,
        height: 24,
        marginRight: 5
    },

    addBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff'
    },

    input: {
        width: '100%',
        paddingVertical: 17,
        paddingHorizontal: 10,
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 10,
        textAlignVertical: 'top'
    },

    error: {
        color: '#ff0004',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 10,
    },

    imageUploadBtn: {
        width: '100%',
        height: 248,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2b2b2b',
        marginBottom: 10
    },

    post: {
        width: '100%',
        height: 250,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 24
    },

    postImage: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        resizeMode: 'cover',
        marginBottom: 11
    },

    postDesc: {
        fontSize: 15,
        fontWeight: 400,
        color: '#fff',
        opacity: 0.5,
        marginBottom: 11,
        overflow: 'hidden'
    }

});

export default Community;