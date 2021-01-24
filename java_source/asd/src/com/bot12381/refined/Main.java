package com.bot12381.refined;

import java.util.ArrayList;
import java.util.HashMap;

import com.zhekasmirnov.apparatus.api.container.ItemContainer;
import com.zhekasmirnov.horizon.runtime.logger.Logger;
import java.lang.System;
import com.zhekasmirnov.innercore.api.mod.recipes.workbench.RecipeEntry;
import com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchRecipe;
import com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchRecipeRegistry;
import org.mozilla.javascript.ScriptableObject;
import com.zhekasmirnov.innercore.api.NativeItemInstanceExtra;
import com.zhekasmirnov.innercore.api.commontypes.ItemInstance;
import java.util.List;
import java.util.Iterator;
import com.zhekasmirnov.innercore.api.mod.ScriptableObjectHelper;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI.Item;
import java.util.HashSet;
import com.zhekasmirnov.innercore.api.NativeItem;
import org.mozilla.javascript.ConsString;
import java.lang.CharSequence;
import java.util.Comparator;
import com.zhekasmirnov.apparatus.api.container.ItemContainerSlot;
import java.util.Arrays;
import java.lang.Error;
import org.mozilla.javascript.MembersPatch;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI.IDRegistry;
import com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchFieldAPI;
//import org.mozilla.javascript.NativeArray;

public class Main {
    public static void boot(HashMap data) {
        Logger.debug("Refined Storage", "Loading java side...");
    }
    public Main(){

    }
    public long test(){
        long startTime = System.currentTimeMillis();
        ArrayList a = new ArrayList<Integer>();
        for(int i = 0; i < 1000000; i++){
            a.add(i);
        };
        return System.currentTimeMillis() - startTime;
    }
    public String getItemUid(RecipeEntry item){
        return item.id + "_" + item.data;
    }
    public String getItemUid(ItemInstance item){
        return item.getId() + "_" + item.getData() + (item.getExtraValue() != 0 ? "_" + item.getExtraValue() : "");
    }
    public Object[] sortCrafts(List items, String textSearch, ScriptableObject originalOnlyItemsMap, ScriptableObject items2, List bonusItems, ScriptableObject isDarkenMap){
        HashSet hashSet = new HashSet();
        Logger.debug("RefinedStorageDebug", "Items length: " + items.size());
        for(int i = 0; i < items.size(); i++){
            ItemContainerSlot item = (ItemContainerSlot) ScriptableObjectHelper.getProperty(items2, String.valueOf(items.get(i)), null);
            WorkbenchRecipeRegistry.addRecipesThatContainItem(item.id, item.data, hashSet);
        }
        Logger.debug("RefinedStorageDebug", "bonusItems length: " + bonusItems.size());
        for(int k = 0; k < bonusItems.size(); k++){
            ScriptableObject item2 = (ScriptableObject) bonusItems.get(k);
            WorkbenchRecipeRegistry.addRecipesThatContainItem((int) ScriptableObjectHelper.getProperty(item2, "id", 0), (int) ScriptableObjectHelper.getProperty(item2, "data", 0), hashSet);
        }
        ArrayList<WorkbenchRecipe> newArray = new ArrayList<WorkbenchRecipe>();
        ArrayList<WorkbenchRecipe> posArray = new ArrayList<WorkbenchRecipe>();
        Iterator<WorkbenchRecipe> it = hashSet.iterator();
        while (it.hasNext()) {
            WorkbenchRecipe jRecipe = it.next();
            if(textSearch != null) {
                ItemInstance result = jRecipe.getResult();
                String name = NativeItem.getNameForId(result.getId(), result.getData() != -1 ? result.getData() : 0);
                if(name.toLowerCase().indexOf(textSearch.toLowerCase()) == -1) continue;
            }
            boolean isDarken = isDarkenSlot(jRecipe, originalOnlyItemsMap);
            isDarkenMap.put("e" + jRecipe.getRecipeUid(), isDarkenMap, Boolean.valueOf(isDarken));
            if(isDarken){
                newArray.add(jRecipe);
            } else {
                posArray.add(jRecipe);
            }
        }
        posArray.addAll(newArray);
        Logger.debug("RefinedStorageDebug", "Sorting ended");
        return posArray.toArray();
    }
    public boolean isDarkenSlot(WorkbenchRecipe javaRecipe, ScriptableObject originalOnlyItemsMap){
        Iterator<RecipeEntry> values = javaRecipe.getEntryCollection().iterator();
        while (values.hasNext()) {
            RecipeEntry item = values.next();
            if(item == null || item.id == 0) continue;
            List<Object> Array = (List<Object>) originalOnlyItemsMap.get((item != null ? item.id : 0));
            if(Array == null || (item.data != -1 && !Array.contains(Integer.valueOf(item.data)))) {
                return true;
            }
        }
		return false;
    }
    public Object[] sortItems(int sortType, boolean isReverse, String textSearch, ItemContainer container, List<Object> array){
        Object[] newArray;
        if(textSearch != null){
            ArrayList<Object> newArray2 = new ArrayList<Object>();
            for(int i = 0; i < array.size(); i++){
                ItemContainerSlot slot = container.getSlot(array.get(i).toString());
                String name = Item.getName(slot.getId(), slot.getData(), slot.getExtra());
                if(name.toLowerCase().indexOf(textSearch.toLowerCase()) != -1) newArray2.add(array.get(i));
            }
            newArray = newArray2.toArray();
        } else {
            newArray = array.toArray();
        }
        Comparator<Object> comparator = new Comparator<Object>(){
            public int compare(Object a, Object b) {
                return 0;
            }
        };
        if (isReverse) {
            if (sortType == 2) { 
                comparator = new Comparator<Object>(){
                    public int compare(Object a, Object b) {
                        return container.getSlot(b.toString()).getId() - container.getSlot(a.toString()).getId();
                    }
                };
            } else if (sortType == 0) {
                comparator = new Comparator<Object>(){
                    public int compare(Object a, Object b) {
                        ItemContainerSlot slot1 = container.getSlot(a.toString());
                        ItemContainerSlot slot2 = container.getSlot(b.toString());
                        return slot1.getCount() == 0 || slot2.getCount() == 0 ? slot2.getCount() - slot1.getCount() : slot1.getCount() - slot2.getCount();
                    }
                };
            } else if (sortType == 1) {
                comparator = new Comparator<Object>(){
                    public int compare(Object a, Object b) {
                        ItemContainerSlot slot1 = container.getSlot(a.toString());
                        ItemContainerSlot slot2 = container.getSlot(b.toString());
                        if(slot1.getId() == 0 || slot2.getId() == 0) return slot2.getId() - slot1.getId();
                        String name1 = Item.getName(slot1.getId(), slot1.getData(), slot1.getExtra());
                        String name2 = Item.getName(slot2.getId(), slot2.getData(), slot2.getExtra());
                        return name2.compareToIgnoreCase(name1);
                    }
                };
            }
        } else {
            if (sortType == 2) {
                comparator = new Comparator<Object>(){
                    public int compare(Object a, Object b) {
                        ItemContainerSlot slot1 = container.getSlot(a.toString());
                        ItemContainerSlot slot2 = container.getSlot(b.toString());
                        return slot1.getId() == 0 || slot2.getId() == 0 ? slot2.getId() - slot1.getId() : slot1.getId() - slot2.getId();
                    }
                };
            } else if (sortType == 0) {
                comparator = new Comparator<Object>(){
                    public int compare(Object a, Object b) {
                        return container.getSlot(b.toString()).getCount() - container.getSlot(a.toString()).getCount();
                    }
                };
            } else if (sortType == 1) {
                comparator = new Comparator<Object>(){
                    public int compare(Object a, Object b) {
                        ItemContainerSlot slot1 = container.getSlot(a.toString());
                        ItemContainerSlot slot2 = container.getSlot(b.toString());
                        if(slot1.getId() == 0 || slot2.getId() == 0) return slot2.getId() - slot1.getId();
                        String name1 = Item.getName(slot1.getId(), slot1.getData(), slot1.getExtra());
                        String name2 = Item.getName(slot2.getId(), slot2.getData(), slot2.getExtra());
                        return name1.compareToIgnoreCase(name2);
                    }
                };
            }
        }
        Arrays.sort(newArray, comparator);
        return newArray;
    }
}