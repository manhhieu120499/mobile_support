import { TouchableWithoutFeedback } from "react-native";
import { View } from "react-native";
import { Modal } from "react-native";

export default function ModalBottom ({children, isOpenModal, closeModal, heightTop = 'unset', padding = 10}) {
    return (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isOpenModal}
          onRequestClose={closeModal}
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }} />
            </TouchableWithoutFeedback>
  
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: heightTop,
              backgroundColor: 'white',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              padding: padding
            }}>
              {children}
            </View>
          </View>
        </Modal>
      )
}