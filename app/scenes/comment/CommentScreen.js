import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { getMessages, sendMessage } from '../../services/user';
import { useAsync } from '../../hooks/useAsync';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Loading from '../rit/Loading';
import { useAuth } from '../../providers/auth';
import moment from 'moment';

const Comment = ({ route }) => {
  const { state } = useAuth();
  const user = state.user;
  const { year, receiver } = route.params;
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);

  const { execute, response, status } = useAsync(() =>
    getMessages(year._id, receiver),
  );

  useEffect(() => {
    if (status === 'success') {
      setMessages(response.data.messages);
    }
  }, [status]);

  const handleSend = async () => {
    if (messageText === '') {
      return false;
    }
    let data = {
      receiver: receiver,
      content: messageText,
      timestamp: new Date(),
      isRead: false,
      isArchived: false,
      year: year._id,
    };
    await sendMessage(data);
    setMessageText('');
    await execute();
  };

  const renderMessages = (message, index) => {
    const isSentByUser = message.sender._id === user._id;
    const messageContainerStyle = isSentByUser
      ? styles.sentMessageContainer
      : styles.receivedMessageContainer;
    const messageTextStyle = isSentByUser
      ? styles.sentMessageText
      : styles.receivedMessageText;

    return (
      <View
        key={index}
        style={[styles.messageContainer, messageContainerStyle]}
      >
        <Text style={[styles.messageText, messageTextStyle]}>
          {message.content}
        </Text>
        <Text style={styles.messageAuthor}>
          {isSentByUser ? 'Eu' : message.sender.firstName}
        </Text>
        <Text style={styles.messageTimestamp}>
          {moment.utc(message.timestamp).format('DD/MM/YYYY')}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView style={styles.messagesContainer}>
          {status === 'pending' && <Loading />}
          {status === 'success' && messages.map(renderMessages)}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Digite uma mensagem"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  messagesContainer: {
    flex: 1,
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  messageAuthor: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 2,
  },
  messageTimestamp: {
    fontSize: 12,
    color: 'lightgray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#b32c33',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  sentMessageContainer: {
    width: '95%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  receivedMessageContainer: {
    width: '95%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default Comment;
