import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView, Alert, ImageBackground } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native'
import { Calendar } from 'react-native-calendars';
import Icons from './Icons';

const { height, width } = Dimensions.get('screen');

const ProjectDetails = ({ project }) => {
    const navigation = useNavigation(); 
    const [calendar, setCalendar] = useState(false);
    const [title, setTitle] = useState(project.title);
    const [style, setStyle] = useState(project.style);
    const [desc, setDesc] = useState(project.desc);
    const [startDate, setStartDate] = useState(project.startDate);
    const [endDate, setEndDate] = useState(project.endDate);
    const [selectingDate, setSelectingDate] = useState('start');
    const [budget, setBudget] = useState(project.budget);
    const [location, setLocation] = useState(project.location);
    const [category, setCategory] = useState(project.category);
    const [imageURI, setImageURI] = useState(project.imageURI);

    const [titleError, setTitleError] = useState('');
    const [styleError, setStyleError] = useState('');
    const [descError, setDescError] = useState('');
    const [startDateError, setStartDateError] = useState('');
    const [endDateError, setEndDateError] = useState('');
    const [budgetError, setBudgetError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [isValid, setIsValid] = useState(true);

    const handleDayPress = (day) => {
        const rawDate = new Date(day.dateString);
        const formattedDate = `${String(rawDate.getDate()).padStart(2, '0')}.${String(rawDate.getMonth() + 1).padStart(2, '0')}.${rawDate.getFullYear()}`;
    
        if (selectingDate === 'start') {
            setStartDate(formattedDate);
        } else if (selectingDate === 'end') {
            setEndDate(formattedDate);
        }
    
        setCalendar(false);
    }; 

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

    const validation = () => {
        let valid = true;

        setTitleError('');
        setStyleError('');
        setDescError('');
        setStartDateError('');
        setEndDateError('');
        setBudgetError('');
        setLocationError('');
        setCategoryError('');

        if (!title) {
            setTitleError('Title cannot be empty.');
            valid = false;
        }

        if (!style) {
            setStyleError('Style cannot be empty.');
            valid = false;
        }

        if (!desc) {
            setDescError('Description cannot be empty.');
            valid = false;
        }

        if (!startDate) {
            setStartDateError('Please select a start date.');
            valid = false;
        }
        
        if (!endDate) {
            setEndDateError('Please select an end date.');
            valid = false;
        } else {
            const start = new Date(startDate.split('.').reverse().join('-'));
            const end = new Date(endDate.split('.').reverse().join('-'));
        
            if (start >= end) {
                setStartDateError('Start date must be before end date.');
                valid = false;
            }
        
            const today = new Date();
            if (end <= today) {
                setEndDateError('End date must be in the future.');
                valid = false;
            }
        }
        
        if (!budget) {
            setBudgetError('Budget cannot be empty.');
            valid = false;
        }

        if (!location) {
            setLocationError('Project location cannot be empty.');
            valid = false;
        }

        if (!category) {
            setCategoryError('Project category cannot be empty.');
            valid = false;
        }

        if(valid) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }

        if (!valid) return;

    };

    const editProject = async () => {
        validation();

        const updatedProject = {
            ...project,
            title,
            style,
            desc,
            startDate,
            endDate,
            budget,
            location,
            category,
            imageURI,
            inprogress: true,
            done: false
        };
    
        try {
            const existingProjects = await AsyncStorage.getItem('projects');
            const projectsArray = existingProjects ? JSON.parse(existingProjects) : [];
    
            const updatedProjectsArray = projectsArray.map((item) => 
                item.id === project.id ? updatedProject : item
            );
    
            await AsyncStorage.setItem('projects', JSON.stringify(updatedProjectsArray));
            Alert.alert("Success", "Project updated successfully!");
    
            navigation.goBack();
        } catch (error) {
            console.error("Error updating project:", error);
            Alert.alert("Error", "Failed to update project. Please try again.");
        }
    };

    const submitProject = async () => {
        validation();

        const updatedProject = {
            ...project,
            title,
            style,
            desc,
            startDate,
            endDate,
            budget,
            location,
            category,
            imageURI,
            inprogress: false,
            done: true
        };
    
        try {
            const existingProjects = await AsyncStorage.getItem('projects');
            const projectsArray = existingProjects ? JSON.parse(existingProjects) : [];
    
            const updatedProjectsArray = projectsArray.map((item) => 
                item.id === project.id ? updatedProject : item
            );
    
            await AsyncStorage.setItem('projects', JSON.stringify(updatedProjectsArray));
            Alert.alert("Success", "Project updated and moved to finished successfully!");
    
            navigation.goBack();
        } catch (error) {
            console.error("Error updating project:", error);
            Alert.alert("Error", "Failed to update project. Please try again.");
        }
    };
    
    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex:1}}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                    <Icons type={'back'} />
                </TouchableOpacity>

                <Text style={styles.title}>Garden Project</Text>

                <ScrollView style={{width: '100%'}}>

                    <TextInput
                        value={title}
                        placeholder='Title'
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        onChangeText={(w) => setTitle(w)}
                        style={styles.input}
                    />
                    {titleError ? <Text style={styles.error}>{titleError}</Text> : null}

                    <TextInput
                        value={style}
                        placeholder='Style'
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        onChangeText={(w) => setStyle(w)}
                        style={styles.input}
                    />
                    {styleError ? <Text style={styles.error}>{styleError}</Text> : null}

                    <View style={{width: '100%'}}>
                        <TextInput
                            value={startDate}
                            placeholder='Start date'
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            style={[styles.input, {paddingLeft: 44}]}
                            editable={false}
                        />
                        <TouchableOpacity style={styles.calendarIcon} onPress={() => { setSelectingDate('start'); setCalendar(true); }}>
                            <Icons type={'calendar'} />
                        </TouchableOpacity>
                    </View>
                    {startDateError ? <Text style={styles.error}>{startDateError}</Text> : null}

                    <View style={{width: '100%'}}>
                        <TextInput
                            value={endDate}
                            placeholder='End date'
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            style={[styles.input, {paddingLeft: 44}]}
                            editable={false}
                        />
                        <TouchableOpacity style={styles.calendarIcon} onPress={() => { setSelectingDate('end'); setCalendar(true); }}>
                            <Icons type={'calendar'} />
                        </TouchableOpacity>
                    </View>
                    {endDateError ? <Text style={styles.error}>{endDateError}</Text> : null}

                    {
                        calendar && (
                            <Calendar
                                style={{ width: width * 0.89, borderRadius: 12, marginBottom: 10 }}
                                onDayPress={handleDayPress}
                                markedDates={{
                                    [startDate]: { selected: selectingDate === 'start', selectedColor: '#ff0004' },
                                    [endDate]: { selected: selectingDate === 'end', selectedColor: '#ff0004' },
                                }}
                                theme={{
                                    selectedDayBackgroundColor: '#ff0004',
                                    todayTextColor: '#ff0004',
                                    arrowColor: '#ff0004',
                                    textDayFontWeight: '500',
                                    textMonthFontWeight: 'bold',
                                    textDayHeaderFontWeight: '500',
                                }}
                            />
                        )
                    }

                    <TextInput
                        value={location}
                        placeholder='Project location'
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        onChangeText={(w) => setLocation(w)}
                        style={styles.input}
                    />
                    {locationError ? <Text style={styles.error}>{locationError}</Text> : null}

                    <TextInput
                        value={budget ? `${budget} $` : ''}
                        placeholder='Planned budget'
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        onChangeText={(b) => {
                            const numericValue = b.replace(/[^0-9]/g, '');
                            setBudget(numericValue);
                        }}
                        style={styles.input}
                    />
                    {budgetError ? <Text style={styles.error}>{budgetError}</Text> : null}

                    <TextInput
                        value={desc}
                        placeholder='Description'
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        onChangeText={(d) => setDesc(d)}
                        multiline={true}
                        style={[styles.input, {height: 100}]}
                    />
                    {descError ? <Text style={styles.error}>{descError}</Text> : null}

                    <TextInput
                        value={category}
                        placeholder='Project category'
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        onChangeText={(w) => setCategory(w)}
                        style={styles.input}
                    />
                    {categoryError ? <Text style={styles.error}>{categoryError}</Text> : null}

                    <Text style={styles.planText}>Garden plan</Text>

                    <TouchableOpacity style={styles.imageUploadBtn} onPress={handleImageUpload}>
                        {imageURI ? (
                            <Image source={{ uri: imageURI }} style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 12 }} />
                        ) : (
                            <Image source={require('../assets/decor/image.png')} style={{width: 124, height: 124}} />
                        )}
                    </TouchableOpacity>


                    <View style={{height: 200}} />

                </ScrollView>

                <TouchableOpacity style={[styles.doneBtn, {backgroundColor: '#0080ff', bottom: height * 0.15}, !isValid && {backgroundColor: '#2b2b2b'}]} onPress={editProject}>
                    <View style={[styles.doneIcon, {marginRight: 6}]}>
                        <Icons type={'edit'} />
                    </View>
                    <Text style={styles.doneBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.doneBtn, !isValid && {backgroundColor: '#2b2b2b'}]} onPress={submitProject}>
                    <View style={styles.doneIcon}>
                        <Icons type={'done'} />
                    </View>
                    <Text style={styles.doneBtnText}>Done</Text>
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
        top: height * 0.065,
        left: 20
    },

    doneBtn: {
        position: 'absolute',
        bottom: height * 0.05,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#ff0004',
        padding: 16
    },

    doneIcon: {
        width: 24,
        height: 24,
        marginRight: 5
    },

    doneBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff'
    },

    calendarIcon: {
        width: 24,
        height: 24,
        position: 'absolute',
        top: 14,
        left: 10
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

    planText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
        marginBottom: 8,
    },

    imageUploadBtn: {
        width: '100%',
        height: 248,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2b2b2b'
    }

});

export default ProjectDetails;