import { MaterialIcons } from '@expo/vector-icons';

const Icons = {};

const Add = () => <MaterialIcons name='add' size={16} />;
const Close = () => <MaterialIcons name='close' size={16} />;
const Delete = () => <MaterialIcons name='delete' size={16} />;
const Edit = () => <MaterialIcons name='edit' size={16} />;
const Favourite = () => <MaterialIcons name='favorite' size={20} color='crimson' />;
const NotFavourite = () => <MaterialIcons name='favorite-border' size={20} color='grey' />;
const Submit = () => <MaterialIcons name='check' size={16} />;

// Compose
Icons.Add = Add;
Icons.Close = Close;
Icons.Delete = Delete;
Icons.Edit = Edit;
Icons.Favourite = Favourite;
Icons.NotFavourite = NotFavourite;
Icons.Submit = Submit;

export default Icons;
