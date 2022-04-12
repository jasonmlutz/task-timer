Rails.application.routes.draw do
  namespace :api do
    resources :users, only: [:create]
  end
  root 'app#index'
end
