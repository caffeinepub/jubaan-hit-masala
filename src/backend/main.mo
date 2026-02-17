import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type ProductId = Nat;
  type CategoryId = Nat;
  type OrderId = Nat;

  public type Product = {
    productId : ProductId;
    name : Text;
    price : Nat;
    description : Text;
    imageUrl : ?Text;
    categoryId : CategoryId;
    inStock : Bool;
  };

  public type Category = {
    categoryId : CategoryId;
    name : Text;
    description : Text;
  };

  public type CartItem = {
    productId : ProductId;
    quantity : Nat;
  };

  public type CustomerDetails = {
    name : Text;
    phone : Text;
    address : Text;
    city : Text;
    state : Text;
    pinCode : Text;
  };

  public type PaymentMethod = {
    #cashOnDelivery;
    #upi : { upiId : Text };
  };

  public type PaymentStatus = {
    #pending;
    #paid;
    #failed;
  };

  public type Order = {
    orderId : OrderId;
    cartItems : [CartItem];
    totalAmount : Nat;
    customerDetails : CustomerDetails;
    paymentMethod : PaymentMethod;
    paymentStatus : PaymentStatus;
  };

  public type UserProfile = {
    name : Text;
    phone : ?Text;
    address : ?Text;
    city : ?Text;
    state : ?Text;
    pinCode : ?Text;
  };

  // Storage
  let products = Map.empty<ProductId, Product>();
  let categories = Map.empty<CategoryId, Category>();
  let orders = Map.empty<OrderId, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextProductId = 1;
  var nextCategoryId = 1;
  var nextOrderId = 1;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Catalog Management (Admin-only)
  public shared ({ caller }) func addCategory(name : Text, description : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };

    let categoryId = nextCategoryId;
    categories.add(
      categoryId,
      { categoryId; name; description }
    );
    nextCategoryId += 1;
  };

  public shared ({ caller }) func updateCategory(categoryId : CategoryId, name : Text, description : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };

    switch (categories.get(categoryId)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {
        categories.add(categoryId, { categoryId; name; description });
      };
    };
  };

  public shared ({ caller }) func addProduct(
    name : Text,
    price : Nat,
    description : Text,
    imageUrl : ?Text,
    categoryId : CategoryId,
    inStock : Bool
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let productId = nextProductId;
    products.add(
      productId,
      { productId; name; price; description; imageUrl; categoryId; inStock }
    );
    nextProductId += 1;
  };

  public shared ({ caller }) func updateProduct(
    productId : ProductId,
    name : Text,
    price : Nat,
    description : Text,
    imageUrl : ?Text,
    categoryId : CategoryId,
    inStock : Bool
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.add(
          productId,
          { productId; name; price; description; imageUrl; categoryId; inStock }
        );
      };
    };
  };

  // Catalog Browsing (Public - accessible to all including guests)
  public query func getCategories() : async [Category] {
    categories.values().toArray();
  };

  public query func getProductsByCategory(categoryId : CategoryId) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.categoryId == categoryId;
      }
    );
  };

  public query func getProduct(productId : ProductId) : async ?Product {
    products.get(productId);
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  // Cart and Order (Public - guests can place orders)
  public shared func placeOrder(
    cartItems : [CartItem],
    customerDetails : CustomerDetails,
    paymentMethod : PaymentMethod
  ) : async OrderId {
    // Validate cart items exist and calculate total
    var totalAmount = 0;
    for (item in cartItems.vals()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product not found: " # item.productId.toText()) };
        case (?product) {
          if (not product.inStock) {
            Runtime.trap("Product out of stock: " # product.name);
          };
          totalAmount += item.quantity * product.price;
        };
      };
    };

    // Validate customer details
    if (customerDetails.name.size() == 0) {
      Runtime.trap("Customer name is required");
    };
    if (customerDetails.phone.size() == 0) {
      Runtime.trap("Customer phone is required");
    };
    if (customerDetails.address.size() == 0) {
      Runtime.trap("Customer address is required");
    };

    let orderId = nextOrderId;
    orders.add(
      orderId,
      {
        orderId;
        cartItems;
        totalAmount;
        customerDetails;
        paymentMethod;
        paymentStatus = #pending;
      }
    );
    nextOrderId += 1;
    orderId;
  };

  // Order Management
  public shared ({ caller }) func updatePaymentStatus(orderId : OrderId, status : PaymentStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update payment status");
    };

    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
    orders.add(
      orderId,
      { order with paymentStatus = status }
    );
  };

  public shared ({ caller }) func markOrderAsPaid(orderId : OrderId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can mark orders as paid");
    };

    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
    orders.add(
      orderId,
      { order with paymentStatus = #paid }
    );
  };

  // Order Tracking (Public but requires phone verification)
  public query func trackOrder(orderId : OrderId, phone : Text) : async ?Order {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        // Verify phone number matches
        if (order.customerDetails.phone == phone) {
          ?order;
        } else {
          null; // Don't reveal order exists if phone doesn't match
        };
      };
    };
  };

  // Admin-only order management
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getOrder(orderId : OrderId) : async ?Order {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view order details");
    };
    orders.get(orderId);
  };

  // Demo Data Seeding (Admin-only)
  public shared ({ caller }) func seedDemoData() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can seed demo data");
    };

    let categoryList = [
      { categoryId = 1; name = "Masalas"; description = "India-wide masala collection" },
      { categoryId = 2; name = "Spices"; description = "Organic spices" },
      { categoryId = 3; name = "Instant Mixes"; description = "Ready-to-cook mixes" },
      { categoryId = 4; name = "Rice"; description = "Premium rice collection" },
      { categoryId = 5; name = "Atta"; description = "High-quality wheat flour" },
      { categoryId = 6; name = "Besan"; description = "Finest Bengal gram flour" },
    ];

    for (category in categoryList.vals()) {
      categories.add(category.categoryId, category);
    };

    let productList = [
      // Masalas
      {
        productId = 1;
        name = "Garam Masala";
        price = 15900;
        description = "Blend of premium spices from across India";
        imageUrl = ?"https://example.com/garam-masala.jpg";
        categoryId = 1;
        inStock = true;
      },
      {
        productId = 2;
        name = "Cardamom";
        price = 89900;
        description = "Whole green cardamom pods";
        imageUrl = ?"https://example.com/cardamom.jpg";
        categoryId = 1;
        inStock = true;
      },
      {
        productId = 3;
        name = "Chaat Masala";
        price = 12900;
        description = "Tangy chaat masala blend";
        imageUrl = ?"https://example.com/chaat-masala.jpg";
        categoryId = 1;
        inStock = true;
      },

      // Spices
      {
        productId = 4;
        name = "Organic Turmeric";
        price = 37900;
        description = "Pure ground organic turmeric";
        imageUrl = ?"https://example.com/turmeric.jpg";
        categoryId = 2;
        inStock = true;
      },
      {
        productId = 5;
        name = "Red Chilli Powder";
        price = 19900;
        description = "Premium red chilli powder";
        imageUrl = ?"https://example.com/chilli.jpg";
        categoryId = 2;
        inStock = true;
      },
      {
        productId = 6;
        name = "Coriander Powder";
        price = 14900;
        description = "Freshly ground coriander";
        imageUrl = ?"https://example.com/coriander.jpg";
        categoryId = 2;
        inStock = true;
      },

      // Instant Mixes
      {
        productId = 7;
        name = "Sambar Powder";
        price = 24900;
        description = "Instant sambar powder mix";
        imageUrl = ?"https://example.com/sambar.jpg";
        categoryId = 3;
        inStock = true;
      },
      {
        productId = 8;
        name = "Idli Mix";
        price = 18900;
        description = "Ready-to-make idli mix";
        imageUrl = ?"https://example.com/idli.jpg";
        categoryId = 3;
        inStock = true;
      },

      // Rice
      {
        productId = 9;
        name = "Basmati Rice (5kg)";
        price = 43900;
        description = "Aromatic royal basmati rice";
        imageUrl = ?"https://example.com/basmati.jpg";
        categoryId = 4;
        inStock = true;
      },
      {
        productId = 10;
        name = "Sona Masoori Rice (5kg)";
        price = 32900;
        description = "Premium sona masoori rice";
        imageUrl = ?"https://example.com/sona-masoori.jpg";
        categoryId = 4;
        inStock = true;
      },

      // Atta
      {
        productId = 11;
        name = "Organic Wheat Atta";
        price = 29900;
        description = "Stone-ground organic wheat flour";
        imageUrl = ?"https://example.com/atta.jpg";
        categoryId = 5;
        inStock = true;
      },
      {
        productId = 12;
        name = "Multigrain Atta";
        price = 34900;
        description = "Healthy multigrain flour blend";
        imageUrl = ?"https://example.com/multigrain.jpg";
        categoryId = 5;
        inStock = true;
      },

      // Besan
      {
        productId = 13;
        name = "Finest Besan";
        price = 22900;
        description = "Finely ground besan flour";
        imageUrl = ?"https://example.com/besan.jpg";
        categoryId = 6;
        inStock = true;
      },
    ];

    for (product in productList.vals()) {
      products.add(product.productId, product);
    };

    nextCategoryId := categoryList.size() + 1;
    nextProductId := productList.size() + 1;
  };
};
