import { MaterialIcons } from "@expo/vector-icons";

const Icons = {};

const Add = () => <MaterialIcons name="add" size={16} />;
const Close = () => <MaterialIcons name="close" size={16} />;
const Delete = () => <MaterialIcons name="delete" size={16} />;
const Edit = () => <MaterialIcons name="edit" size={16} />;
const Favourite = () => (
  <MaterialIcons name="favorite" size={20} color="crimson" />
);
const NotFavourite = () => (
  <MaterialIcons name="favorite-border" size={20} color="grey" />
);
const Submit = () => <MaterialIcons name="check" size={16} />;
const Location = () => <MaterialIcons name="my-location" size={16} />;
const User = () => <MaterialIcons name="person" size={20} color="#555" />;
const Lock = () => <MaterialIcons name="lock" size={20} color="#555" />;
const Eye = () => <MaterialIcons name="visibility" size={20} color="#555" />;
const EyeOff = () => (
  <MaterialIcons name="visibility-off" size={20} color="#555" />
);
const Phone = () => <MaterialIcons name="phone" size={20} color="#555" />;

// Compose
Icons.Add = Add;
Icons.Close = Close;
Icons.Delete = Delete;
Icons.Edit = Edit;
Icons.Favourite = Favourite;
Icons.NotFavourite = NotFavourite;
Icons.Submit = Submit;
Icons.Location = Location;
Icons.User = User;
Icons.Lock = Lock;
Icons.Eye = Eye;
Icons.EyeOff = EyeOff;
Icons.Phone = Phone;

export default Icons;
